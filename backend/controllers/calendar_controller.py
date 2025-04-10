from .controller import Controller

class CalendarController:
    def create_calendar( event_title : str, organizer_email : str):
        calendar = {
            'summary': f'{event_title} Organization',
            'timeZone': 'America/Toronto'
        }
        created_calendar = Controller.service.calendars().insert(body=calendar).execute()

        calendar_id = created_calendar['id']
        CalendarController.share_calendar(calendar_id, organizer_email)
        CalendarController.make_public(calendar_id)
        return calendar_id

    def make_public(calendar_id):
        rule = {
            'scope': {
                'type': 'default'
            },
            'role': 'reader'
        }
    
        try:
            result = Controller.service.acl().insert(calendarId=calendar_id, body=rule).execute()
            return result
        except Exception as e:
            print(f"Failed to make calendar public: {e}")
            return None
        
    def share_calendar(calendar_id, email):
        rule = {
            'scope': {
                'type': 'user',
                'value': email
            },
            'role': 'writer'
        }
        Controller.service.acl().insert(calendarId=calendar_id, body=rule).execute()