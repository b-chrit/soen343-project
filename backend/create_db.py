from models.config import Base, engine
from models import Event, SQLSession
from datetime import datetime, timedelta  # Added timedelta
from models.users import User, Organizer, Stakeholder  # Import Stakeholder for sponsor

Base.metadata.create_all(engine)

with SQLSession() as session:
    # Create and add 10 attendees with meaningful data
    attendees = [
        User(f'attendee{i}@example.com', f'password{i}', f'John{i}', f'Doe{i}')
        for i in range(1, 11)
    ]
    
    for attendee in attendees:
        User.add(session, attendee)

    # Create and add 10 organizers with meaningful data
    organizers = [
        Organizer('organizer1@example.com', 'password1', 'Alice', 'Smith', 'TechCorp', '+1 (514) 555-1234'),
        Organizer('organizer2@example.com', 'password2', 'Bob', 'Johnson', 'FinTechInc', '+1 (514) 555-5678'),
        Organizer('organizer3@example.com', 'password3', 'Charlie', 'Williams', 'StartUpX', '+1 (514) 555-9101'),
        Organizer('organizer4@example.com', 'password4', 'David', 'Jones', 'DigitalMark', '+1 (514) 555-1122'),
        Organizer('organizer5@example.com', 'password5', 'Emma', 'Brown', 'AI Innovations', '+1 (514) 555-2233'),
        Organizer('organizer6@example.com', 'password6', 'Frank', 'Davis', 'VRTech', '+1 (514) 555-3344'),
        Organizer('organizer7@example.com', 'password7', 'Grace', 'Miller', 'BlockChain Solutions', '+1 (514) 555-4455'),
        Organizer('organizer8@example.com', 'password8', 'Hannah', 'Wilson', 'GlobalSummit', '+1 (514) 555-5566'),
        Organizer('organizer9@example.com', 'password9', 'Ian', 'Moore', 'HealthTech Ltd.', '+1 (514) 555-6677'),
        Organizer('organizer10@example.com', 'password10', 'Jack', 'Taylor', 'SmartCity Innovations', '+1 (514) 555-7788'),
    ]
    
    for organizer in organizers:
        User.add(session, organizer)

    # Create and add 10 stakeholders (sponsors) with meaningful data
    stakeholders = [
        Stakeholder('stakeholder1@example.com', 'password11', 'Liam', 'Martinez'),
        Stakeholder('stakeholder2@example.com', 'password12', 'Olivia', 'Garcia'),
        Stakeholder('stakeholder3@example.com', 'password13', 'Noah', 'Rodriguez'),
        Stakeholder('stakeholder4@example.com', 'password14', 'Ava', 'Martinez'),
        Stakeholder('stakeholder5@example.com', 'password15', 'Ethan', 'Lopez'),
        Stakeholder('stakeholder6@example.com', 'password16', 'Sophia', 'Gonzalez'),
        Stakeholder('stakeholder7@example.com', 'password17', 'Mason', 'Hernandez'),
        Stakeholder('stakeholder8@example.com', 'password18', 'Isabella', 'Moore'),
        Stakeholder('stakeholder9@example.com', 'password19', 'James', 'Taylor'),
        Stakeholder('stakeholder10@example.com', 'password20', 'Amelia', 'Jackson'),
    ]
    
    for stakeholder in stakeholders:
        User.add(session, stakeholder)

 # Create 10 events with meaningful data linked to organizers and sponsors
    event_data = [
        {
            'title': 'Tech Expo 2025',
            'start': '2025-06-01 09:00:00',
            'end': '2025-06-01 17:00:00',
            'category': 'Technology',
            'description': 'An expo showcasing the latest in tech innovations and gadgets.',
            'location': '1234 Tech Street, Montreal',
            'organizer_id': 1,
            'sponsor_id': 1
        },
        {
            'title': 'FinTech Conference 2025',
            'start': '2025-06-10 09:00:00',
            'end': '2025-06-10 17:00:00',
            'category': 'Finance',
            'description': 'A conference focused on the intersection of finance and technology.',
            'location': '5678 Finance Ave, Montreal',
            'organizer_id': 2,
            'sponsor_id': 2
        },
        {
            'title': 'Startup Weekend 2025',
            'start': '2025-07-05 09:00:00',
            'end': '2025-07-05 18:00:00',
            'category': 'Business',
            'description': 'A weekend-long event designed to help launch new startups.',
            'location': '1234 Startup Road, Montreal',
            'organizer_id': 3,
            'sponsor_id': 3
        },
        {
            'title': 'Digital Marketing Summit 2025',
            'start': '2025-08-20 09:00:00',
            'end': '2025-08-20 17:00:00',
            'category': 'Marketing',
            'description': 'A summit exploring cutting-edge strategies for digital marketing.',
            'location': '8901 Marketing Blvd, Montreal',
            'organizer_id': 4,
            'sponsor_id': 4
        },
        {
            'title': 'AI & Machine Learning Summit 2025',
            'start': '2025-09-15 09:00:00',
            'end': '2025-09-15 17:00:00',
            'category': 'AI & Tech',
            'description': 'A summit focused on advancements in artificial intelligence and machine learning.',
            'location': '2468 AI Street, Montreal',
            'organizer_id': 5,
            'sponsor_id': 5
        },
        {
            'title': 'Virtual Reality Expo 2025',
            'start': '2025-09-20 09:00:00',
            'end': '2025-09-20 17:00:00',
            'category': 'Technology',
            'description': 'An exhibition showcasing the latest in virtual reality innovations.',
            'location': '9876 VR Lane, Montreal',
            'organizer_id': 6,
            'sponsor_id': 6
        },
        {
            'title': 'Blockchain Conference 2025',
            'start': '2025-10-10 09:00:00',
            'end': '2025-10-10 17:00:00',
            'category': 'Tech & Business',
            'description': 'A conference discussing the impact of blockchain technology on various industries.',
            'location': '5555 Blockchain Ave, Montreal',
            'organizer_id': 7,
            'sponsor_id': 7
        },
        {
            'title': 'Global Business Summit 2025',
            'start': '2025-11-12 09:00:00',
            'end': '2025-11-12 17:00:00',
            'category': 'Business & Leadership',
            'description': 'A global summit for business leaders to discuss emerging trends and innovations.',
            'location': '1122 Global Ave, Montreal',
            'organizer_id': 8,
            'sponsor_id': 8
        },
        {
            'title': 'HealthTech Conference 2025',
            'start': '2025-12-01 09:00:00',
            'end': '2025-12-01 17:00:00',
            'category': 'Healthcare',
            'description': 'A conference focused on the role of technology in advancing healthcare.',
            'location': '3344 Health Street, Montreal',
            'organizer_id': 9,
            'sponsor_id': 9
        },
        {
            'title': 'Smart City Expo 2025',
            'start': '2025-12-15 09:00:00',
            'end': '2025-12-15 17:00:00',
            'category': 'Urban Development',
            'description': 'An expo exploring the latest innovations in smart city technologies.',
            'location': '7788 City Blvd, Montreal',
            'organizer_id': 10,
            'sponsor_id': 10
        },
        {
            'title': 'Sustainable Architecture Conference 2025',
            'start': '2025-12-15 10:00:00',
            'end': '2025-12-15 16:00:00',
            'category': 'Urban Development',
            'description': 'A conference showcasing sustainable design and construction techniques for modern cities.',
            'location': '2233 Green Building Lane, Montreal',
            'organizer_id': 9,
            'sponsor_id': 8
        },
        {
            'title': 'Future Mobility Summit 2025',
            'start': '2025-12-15 11:00:00',
            'end': '2025-12-15 17:30:00',
            'category': 'Transportation & Mobility',
            'description': 'An event focused on the future of urban transportation, including autonomous vehicles and smart transit systems.',
            'location': '4455 Mobility Blvd, Montreal',
            'organizer_id': 8,
            'sponsor_id': 7
        }

    ]


    today = datetime.now()

    dynamic_events = [
    # Yesterday events (two)
        {
            'title': 'Entrepreneurship Bootcamp 2025',
            'start': (today - timedelta(days=1)).replace(hour=9, minute=0, second=0),
            'end': (today - timedelta(days=1)).replace(hour=17, minute=0, second=0),
            'category': 'Business',
            'description': 'A full-day workshop designed to help budding entrepreneurs turn their ideas into action plans.',
            'location': '500 Startup Blvd, Montreal',
            'organizer_id': 1,
            'sponsor_id': 2
        },
        {
            'title': 'Marketing Strategies Forum 2025',
            'start': (today - timedelta(days=1)).replace(hour=10, minute=0, second=0),
            'end': (today - timedelta(days=1)).replace(hour=16, minute=0, second=0),
            'category': 'Marketing',
            'description': 'An event discussing modern marketing trends, SEO, and content strategies.',
            'location': '600 Digital Plaza, Montreal',
            'organizer_id': 2,
            'sponsor_id': 3
        },

        # Today events (two)
        {
            'title': 'Cybersecurity Summit 2025',
            'start': today.replace(hour=9, minute=0, second=0),
            'end': today.replace(hour=17, minute=0, second=0),
            'category': 'Technology',
            'description': 'A summit focused on the latest cybersecurity threats and best practices for businesses.',
            'location': '900 Cyber Ave, Montreal',
            'organizer_id': 3,
            'sponsor_id': 4
        },
        {
            'title': 'AI in Healthcare Conference 2025',
            'start': today.replace(hour=10, minute=0, second=0),
            'end': today.replace(hour=18, minute=0, second=0),
            'category': 'AI & Tech',
            'description': 'Exploring how AI is transforming healthcare from diagnostics to treatment planning.',
            'location': '101 HealthTech Way, Montreal',
            'organizer_id': 4,
            'sponsor_id': 5
        }
    ]

    # Combine static and dynamic events
    all_events = event_data + [
        {
            'title': e['title'],
            'start': e['start'].strftime("%Y-%m-%d %H:%M:%S"),
            'end': e['end'].strftime("%Y-%m-%d %H:%M:%S"),
            'category': e['category'],
            'description': e['description'],
            'location': e['location'],
            'organizer_id': e['organizer_id'],
            'sponsor_id': e['sponsor_id']
        }
        for e in dynamic_events
    ]

    # Create the events in the DB
    for event in all_events:
        organizer = organizers[event['organizer_id'] - 1]
        sponsor = stakeholders[event['sponsor_id'] - 1]

        event_start = datetime.strptime(event['start'], "%Y-%m-%d %H:%M:%S")
        event_end = datetime.strptime(event['end'], "%Y-%m-%d %H:%M:%S")

        organizer.create_event(
            session,
            event['title'],
            event_start,
            event_end,
            event['category'],
            event['description'],
            event['location'],
            sponsor.id
        )

    print("✅ 10 attendees, 10 organizers, 10 stakeholders, and events (static + dynamic past/future) have been added successfully!")