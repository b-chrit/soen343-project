from app import app
from models import db, Registration
from controllers import AttendeeController, OrganizerController, EventController
from datetime import datetime, timedelta

with app.app_context():
    db.create_all()

    # --- Create Attendees ---
    a1 = AttendeeController.create_attendee('john.doe@gmail.com', 'password123', 'John', 'Doe')
    a2 = AttendeeController.create_attendee('jane.dae@gmail.com', 'password123', 'Jane', 'Dae')

    # --- Organizer Factory Helper ---
    def make_organizer(index):
        return OrganizerController.create_organizer(
            f'sees-organizer{index}@yopmail.com',
            'password123',
            f'Organizer{index}',
            f'Last{index}',
            f'Org{index}',
            f'(514) 000-00{index:02d}'
        )

    # --- Datetime Formatter ---
    def format_dt(dt: datetime, hour: int) -> str:
        return dt.replace(hour=hour, minute=0).strftime('%Y-%m-%dT%H:%M')

    today = datetime.today()
    yesterday = today - timedelta(days=1)
    base_date = today + timedelta(days=5)
    d10 = today + timedelta(days=10)
    d12 = today + timedelta(days=12)
    d15 = today + timedelta(days=15)

    # --- Events for Today ---
    EventController.create_event(
        make_organizer(1),
        "Today’s Tech Briefing",
        format_dt(today, 9),
        format_dt(today, 17),
        "Technology",
        "An event summarizing today’s top innovations in software, hardware, and AI trends.",
        "Montreal, QC",
        100,
        "In-Person",
        0
    )

    EventController.create_event(
        make_organizer(2),
        "Today’s Finance Roundtable",
        format_dt(today, 10),
        format_dt(today, 15),
        "Finance",
        "Discussion of financial market movements and forecasts as of today.",
        "Online",
        150,
        "Online",
        5.00
    )

    # --- Events for Yesterday ---
    EventController.create_event(
        make_organizer(3),
        "Yesterday’s Cybersecurity Recap",
        format_dt(yesterday, 11),
        format_dt(yesterday, 16),
        "Security",
        "Review of recent cybersecurity incidents and what we learned yesterday.",
        "Montreal, QC",
        80,
        "In-Person",
        0
    )

    EventController.create_event(
        make_organizer(4),
        "Yesterday’s Healthcare Breakthroughs",
        format_dt(yesterday, 9),
        format_dt(yesterday, 14),
        "Healthcare",
        "Panel on yesterday’s medical news and research discoveries.",
        "Online",
        120,
        "Online",
        10.00
    )

    # --- Normal Events (including 2 on same day) ---
    EventController.create_event(
        make_organizer(5),
        "GreenTech Conference",
        format_dt(base_date, 10),
        format_dt(base_date, 17),
        "Environment",
        "Join startups and researchers innovating in sustainable tech and green energy.",
        "Toronto, ON",
        150,
        "In-Person",
        0
    )

    EventController.create_event(
        make_organizer(6),
        "Startup Pitch Night",
        format_dt(base_date, 18),
        format_dt(base_date, 21),
        "Entrepreneurship",
        "Founders pitch their startups to VCs and angel investors. Q&A + networking.",
        "Toronto, ON",
        100,
        "In-Person",
        0
    )

    EventController.create_event(
        make_organizer(7),
        "Data Science Bootcamp",
        format_dt(d10, 9),
        format_dt(d10, 16),
        "Education",
        "Crash course in Python, data wrangling, machine learning, and model deployment.",
        "Montreal, QC",
        200,
        "Online",
        20.00
    )

    EventController.create_event(
        make_organizer(8),
        "E-commerce Logistics Forum",
        format_dt(d12, 11),
        format_dt(d12, 17),
        "Business",
        "Explore last-mile delivery, inventory management, and shipping optimizations.",
        "Vancouver, BC",
        120,
        "In-Person",
        15.00
    )

    EventController.create_event(
        make_organizer(9),
        "Music Tech Hackathon",
        format_dt(d15, 8),
        format_dt(d15, 22),
        "Technology",
        "Hackathon focused on building apps and tools for the music industry.",
        "Hybrid - Toronto & Online",
        250,
        "Hybrid",
        0
    )
