from app import app
from models import db

from controllers import AttendeeController, OrganizerController, EventController, PaymentController


with app.app_context():

    db.create_all()


    a1 = AttendeeController.create_attendee('john.doe@gmail.com', 'password123', 'John', 'Doe')
    a2 = AttendeeController.create_attendee('jane.dae@gmail.com', 'password123', 'Jane', 'Dae')

    o1 = OrganizerController.create_organizer('media@microsoft.com', 'password123', 'Jacob', 'Rodney', 'Microsoft', '(514) 123-4567')
    o2 = OrganizerController.create_organizer('sales@apple.com', 'password123', 'John', 'Smith', 'Apple', '(514) 987-6543')


    EventController.create_event(
        o1, 
        'The future of AI in the workplace',
        '2025-03-26T10:00',
        '2025-03-26T18:00',
        'Technology',
        'Explore how artificial intelligence is reshaping industries, redefining job roles, and influencing workplace dynamics. This event brings together industry leaders, AI researchers, and business executives to discuss automation, workforce adaptation, and the skills needed for the future. Expect insightful keynotes, panel discussions, and networking opportunities with top professionals in AI and business transformation.',
        'Montreal, QC',
        230,
        'In-Person',
        0
        )
    
    EventController.create_event(
        o2, 
        'Fintech Revolution: The Future of Digital Banking',
        '2025-03-26T10:00',
        '2025-03-28T16:00',
        'Finance',
        'Discover how financial technology is reshaping banking, investments, and payment systems. This event brings together fintech innovators, banking executives, and industry disruptors to discuss trends in digital payments, blockchain, AI-driven finance, and regulatory challenges. Expect engaging panels, startup showcases, and networking with top finance and tech professionals.',
        'Montreal, QC',
        230,
        'Online',
        10.00
        )



    # o_id = OrganizerController.create_organizer('org@test.ca', '1234', 'John', 'Doe', 'Org 1', '514 123-4547')

    # OrganizerController.create_event(o_id, 'Networking Event', '2025-03-25T14:30', '2025-03-26T14:30', 'Networking', 'Event for networking', 'Montreal', 500, 'In-Person', 5.00)
    
    #EventController.register_to_event(1,1)


    # a=  EventController.get_available_events()
    # print(a)
    #PaymentController.confirm_registration(1, 1, 'pi_3R6fV8GhbSq2wRPM0INJyvZM_secret_mqT84jyK83jhwioYXI36Baanw')


    

