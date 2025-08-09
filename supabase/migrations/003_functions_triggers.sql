-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update customer visit count
CREATE OR REPLACE FUNCTION update_customer_visits()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers 
    SET 
        total_visits = total_visits + 1,
        last_visit_date = NEW.schedule_date
    WHERE id = NEW.customer_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update customer visits when reservation is completed
CREATE TRIGGER update_customer_visits_trigger 
    AFTER UPDATE ON reservations 
    FOR EACH ROW 
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION update_customer_visits();

-- Function to update schedule availability
CREATE OR REPLACE FUNCTION update_schedule_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Update available seats when reservation is created or cancelled
    IF TG_OP = 'INSERT' THEN
        UPDATE schedules 
        SET available_seats = available_seats - NEW.people_count
        WHERE date = NEW.schedule_date AND trip_number = NEW.trip_number;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- If status changed from confirmed to cancelled
        IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
            UPDATE schedules 
            SET available_seats = available_seats + NEW.people_count
            WHERE date = NEW.schedule_date AND trip_number = NEW.trip_number;
        ELSIF OLD.status = 'cancelled' AND NEW.status = 'confirmed' THEN
            UPDATE schedules 
            SET available_seats = available_seats - NEW.people_count
            WHERE date = NEW.schedule_date AND trip_number = NEW.trip_number;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE schedules 
        SET available_seats = available_seats + OLD.people_count
        WHERE date = OLD.schedule_date AND trip_number = OLD.trip_number;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers for schedule availability
CREATE TRIGGER reservation_availability_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_schedule_availability();