from app import app
from models import db, Registration
from controllers import AttendeeController, OrganizerController, EventController
from datetime import datetime, timedelta

with app.app_context():
    db.create_all()

    # --- Create Attendees ---
    a1 = AttendeeController.create_attendee('alex.johnson@gmail.com', 'password123', 'Alex', 'Johnson')
    a2 = AttendeeController.create_attendee('sarah.parker@gmail.com', 'password123', 'Sarah', 'Parker')
    
    # --- Datetime Formatter (Using the format the controller expects) ---
    def format_datetime(dt: datetime, hour: int, minute: int = 0) -> str:
        return dt.replace(hour=hour, minute=minute).strftime('%Y-%m-%dT%H:%M')

    today = datetime.today()
    yesterday = today - timedelta(days=1)
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(days=7)
    two_weeks = today + timedelta(days=14)
    month_ahead = today + timedelta(days=30)

    # --- Technology Events ---
    tech_organizer1 = OrganizerController.create_organizer(
        'techcorp1@example.com',
        'password123',
        'Michael',
        'Chen',
        'TechCorp Solutions',
        '(514) 555-1001'
    )
    
    EventController.create_event(
        tech_organizer1,
        "Web3 Development Summit",
        format_datetime(tomorrow, 9),
        format_datetime(tomorrow, 17),
        "Technology",
        "Join leading web developers and blockchain specialists to explore the future of decentralized applications. This full-day summit includes workshops on smart contracts, NFT platforms, and decentralized finance applications.",
        "Montreal Convention Center",
        200,
        "In-Person",
        25.00
    )
    
    tech_organizer2 = OrganizerController.create_organizer(
        'techcorp2@example.com',
        'password123',
        'James',
        'Wilson',
        'Cyber Security Inc',
        '(514) 555-1002'
    )
    
    EventController.create_event(
        tech_organizer2,
        "Cybersecurity Best Practices Workshop",
        format_datetime(yesterday, 13),
        format_datetime(yesterday, 16, 30),
        "Technology",
        "A hands-on workshop covering the latest cybersecurity threats and defensive strategies for businesses. Learn how to protect your organization from ransomware, phishing, and supply chain attacks.",
        "Online",
        150,
        "Online",
        0.00
    )
    
    # --- Finance Events ---
    finance_organizer1 = OrganizerController.create_organizer(
        'financegroup1@example.com',
        'password123',
        'Jessica',
        'Williams',
        'Global Finance Group',
        '(514) 555-2001'
    )
    
    EventController.create_event(
        finance_organizer1,
        "Investment Strategies for 2025",
        format_datetime(today, 10),
        format_datetime(today, 12),
        "Finance",
        "Financial experts discuss market trends and investment opportunities for the coming year. Topics include sustainable investing, cryptocurrency portfolio allocation, and global market outlook.",
        "Toronto Financial District",
        75,
        "In-Person",
        50.00
    )
    
    finance_organizer2 = OrganizerController.create_organizer(
        'financegroup2@example.com',
        'password123',
        'Thomas',
        'Miller',
        'Personal Finance Advisors',
        '(514) 555-2002'
    )
    
    EventController.create_event(
        finance_organizer2,
        "Personal Finance Masterclass",
        format_datetime(next_week, 18),
        format_datetime(next_week, 20),
        "Finance",
        "Learn effective strategies for budgeting, debt management, and retirement planning. This masterclass is designed for individuals looking to take control of their financial future.",
        "Online",
        300,
        "Online",
        15.00
    )
    
    # --- Business Events ---
    business_organizer1 = OrganizerController.create_organizer(
        'bizstrategy1@example.com',
        'password123',
        'Robert',
        'Smith',
        'Business Strategy Partners',
        '(514) 555-3001'
    )
    
    EventController.create_event(
        business_organizer1,
        "Startup Scaling Strategies",
        format_datetime(today, 14),
        format_datetime(today, 17),
        "Business",
        "Successful entrepreneurs share their experiences and strategies for scaling startups from seed to series B. Learn about team building, product-market fit, and fundraising in today's competitive environment.",
        "Vancouver Startup Hub",
        100,
        "In-Person",
        35.00
    )
    
    business_organizer2 = OrganizerController.create_organizer(
        'bizstrategy2@example.com',
        'password123',
        'Daniel',
        'Taylor',
        'Supply Chain Consultants',
        '(514) 555-3002'
    )
    
    EventController.create_event(
        business_organizer2,
        "Supply Chain Resilience Forum",
        format_datetime(two_weeks, 9),
        format_datetime(two_weeks, 16),
        "Business",
        "Industry leaders discuss strategies for building resilient supply chains in a post-pandemic world. Sessions cover risk management, supplier diversification, and digital transformation.",
        "Halifax Business Center",
        120,
        "Hybrid",
        45.00
    )
    
    # --- Marketing Events ---
    marketing_organizer1 = OrganizerController.create_organizer(
        'marketpro1@example.com',
        'password123',
        'Emily',
        'Davis',
        'MarketPro Agency',
        '(514) 555-4001'
    )
    
    EventController.create_event(
        marketing_organizer1,
        "Digital Marketing Trends 2025",
        format_datetime(tomorrow, 13),
        format_datetime(tomorrow, 15, 30),
        "Marketing",
        "Explore the latest trends in digital marketing including AI-driven content creation, privacy-first advertising, and emerging social platforms. Case studies from successful campaigns will be presented.",
        "Montreal Digital Hub",
        150,
        "In-Person",
        0.00
    )
    
    marketing_organizer2 = OrganizerController.create_organizer(
        'marketpro2@example.com',
        'password123',
        'Sophia',
        'Garcia',
        'Content Strategy Group',
        '(514) 555-4002'
    )
    
    EventController.create_event(
        marketing_organizer2,
        "Content Strategy Masterclass",
        format_datetime(month_ahead, 10),
        format_datetime(month_ahead, 16),
        "Marketing",
        "A comprehensive workshop on developing and implementing effective content strategies across multiple channels. Learn about audience research, content calendars, and performance measurement.",
        "Online",
        200,
        "Online",
        80.00
    )
    
    # --- AI & Tech Events ---
    ai_tech_organizer1 = OrganizerController.create_organizer(
        'aiinnovate1@example.com',
        'password123',
        'David',
        'Kim',
        'AI Innovations Lab',
        '(514) 555-5001'
    )
    
    EventController.create_event(
        ai_tech_organizer1,
        "AI in Healthcare Symposium",
        format_datetime(next_week, 9),
        format_datetime(next_week, 17),
        "AI & Tech",
        "Medical professionals and AI researchers discuss the latest applications of artificial intelligence in healthcare. Topics include diagnostic algorithms, personalized medicine, and ethical considerations.",
        "Ottawa Medical Center",
        180,
        "Hybrid",
        60.00
    )
    
    ai_tech_organizer2 = OrganizerController.create_organizer(
        'aiinnovate2@example.com',
        'password123',
        'Jennifer',
        'Lee',
        'ML Education Institute',
        '(514) 555-5002'
    )
    
    EventController.create_event(
        ai_tech_organizer2,
        "Machine Learning Bootcamp",
        format_datetime(yesterday, 9),
        format_datetime(yesterday, 17),
        "AI & Tech",
        "An intensive bootcamp covering the fundamentals of machine learning. Participants will work through real-world problems using Python, TensorFlow, and scikit-learn.",
        "Online",
        100,
        "Online",
        120.00
    )
    
    # --- Tech & Business Events ---
    tech_biz_organizer1 = OrganizerController.create_organizer(
        'techbiz1@example.com',
        'password123',
        'Olivia',
        'Brown',
        'Tech & Business Accelerator',
        '(514) 555-6001'
    )
    
    EventController.create_event(
        tech_biz_organizer1,
        "Digital Transformation Conference",
        format_datetime(today, 8, 30),
        format_datetime(today, 16, 30),
        "Tech & Business",
        "Industry leaders share case studies of successful digital transformation initiatives. Learn about change management, technology integration, and measuring business outcomes.",
        "Calgary Business Tower",
        250,
        "In-Person",
        75.00
    )
    
    tech_biz_organizer2 = OrganizerController.create_organizer(
        'techbiz2@example.com',
        'password123',
        'William',
        'Johnson',
        'Future Workplace Institute',
        '(514) 555-6002'
    )
    
    EventController.create_event(
        tech_biz_organizer2,
        "Future of Work Summit",
        format_datetime(two_weeks, 10),
        format_datetime(two_weeks, 18),
        "Tech & Business",
        "Explore how technology is reshaping the workplace. Sessions cover remote collaboration tools, AI automation, and building inclusive digital workplaces.",
        "Edmonton Convention Center",
        200,
        "Hybrid",
        0.00
    )

    print("Seed data created successfully!")