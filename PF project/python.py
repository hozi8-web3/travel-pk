
# Students: M. Hozaifa Ali (2025-SE-148), Hashmatullah Zia (2025-SE-165)
# Institute of Data Science - Session 2025-2029

import json
import os

# File to store all data

DATA_FILE = os.path.join("data", "tourism_data.json")

# Initial data setup demo data
cities = []

current_user = None

# File Handling Functions

def load_data():
    """Load all data from JSON file"""
    
    # Create data folder if it doesn't exist
    data_folder = os.path.dirname(DATA_FILE)
    if data_folder and not os.path.exists(data_folder):
        os.makedirs(data_folder)
    
    if not os.path.exists(DATA_FILE):
        initial_data = {
            "users": [],
            "hotels": [],
            "bookings": [],
            "cities": cities,
            "promo_codes": []
        }
        save_data(initial_data)
        return initial_data  # IMPORTANT: Return the data
    
    try:
        file = open(DATA_FILE, "r")
        data = json.load(file)
        file.close()
        
        # Ensure all required keys exist
        if "cities" not in data:
            data["cities"] = cities
        if "promo_codes" not in data:
            data["promo_codes"] = []
    
        
        return data 
    
    except Exception as e:
        print(f"Error loading data: {e}")
        return {
            "users": [{"username": "admin", "password": "admin123", "points": 0, "role": "admin"}],
            "hotels": [],
            "bookings": [],
            "cities": cities,
            "promo_codes": []
        }



def save_data(data):
    """Save all data to JSON file"""
    file = open(DATA_FILE, "w")
    json.dump(data, file, indent=4)
    file.close()

# --- Helper Functions ---

def clear_screen():
    if os.name == "nt":
        os.system("cls")
    else:
        os.system("clear")

def print_header(title):
    print("=" * 50)
    print(f"  {title}")
    print("=" * 50)

def pause():
    input("\nPress Enter to continue...")

def show_progress_bar(points, max_points=1000):
    """Display loyalty points as a progress bar"""
    percentage = int((points / max_points) * 100)
    if percentage > 100:
        percentage = 100
    
    bar_length = 20
    filled = int((percentage / 100) * bar_length)
    bar = "█" * filled + "░" * (bar_length - filled)
    
    print(f"\nLoyalty Progress: [{bar}] {percentage}%")
    print(f"Points: {points}/{max_points}")

# --- Authentication Functions ---

def login(data):
    global current_user
    
    clear_screen()
    print_header("LOGIN")
    print("(Enter '0' as username to go back)\n")
   
    while True:
        username = input("Username: ")
        
        if username == "0":
            return False
        
        # Check if username exists
        user_found = None
        for user in data["users"]:
            if user["username"] == username:
                user_found = user
                break
        
        if user_found:
            break 
        else:
            print("✗ Username not found! Try again.")
    while True:
        password = input("Password: ")
        
        if user_found["password"] == password:
            current_user = user_found
            print(f"\n✓ Welcome back, {username}!")
            pause()
            return True
        else:
            print("✗ Incorrect password! Try again.")

def signup(data):
    print_header("SIGN UP")
    print("Username Rules: 3-20 characters, letters/numbers/underscore only")
    print("Password Rules: Minimum 6 characters")
    print("(Enter '0' as username to go back)\n")
    
    # Ask for username until valid
    while True:
        username = input("Choose Username: ")
        
        # Allow user to cancel
        if username == "0":
            return False
        
        # Validate username length
        if len(username) < 3:
            print("✗ Username too short! Must be at least 3 characters.")
            continue
        
        if len(username) > 20:
            print("✗ Username too long! Maximum 20 characters.")
            continue
        
        # Validate username characters (only letters, numbers, underscore)
        valid_chars = True
        for char in username:
            if not (char.isalnum() or char == '_'):
                valid_chars = False
                break
        
        if not valid_chars:
            print("✗ Username can only contain letters, numbers, and underscore (_)!")
            continue
        
        # Check if username starts with a letter
        if not username[0].isalpha():
            print("✗ Username must start with a letter!")
            continue
        
        # Check if username already exists
        username_taken = False
        for user in data["users"]:
            if user["username"].lower() == username.lower():
                username_taken = True
                break
        
        if username_taken:
            print("✗ Username already taken! Try another one.")
        else:
            print(f"✓ Username '{username}' is available!")
            break  # Username is valid, move to password
    
    # Ask for password until valid
    while True:
        password = input("Choose Password: ")
        
        # Validate password length
        if len(password) < 6:
            print("✗ Password too short! Must be at least 6 characters.")
            continue
        
        if len(password) > 30:
            print("✗ Password too long! Maximum 30 characters.")
            continue
        
        # Check if password contains at least one letter
        has_letter = False
        for char in password:
            if char.isalpha():
                has_letter = True
                break
        
        if not has_letter:
            print("✗ Password must contain at least one letter!")
            continue
        
        # Check if password contains at least one number
        has_number = False
        for char in password:
            if char.isdigit():
                has_number = True
                break
        
        if not has_number:
            print("✗ Password must contain at least one number!")
            continue
        
        # Confirm password
        confirm = input("Confirm Password: ")
        
        if password != confirm:
            print("✗ Passwords don't match! Try again.")
            continue
        
        print("✓ Password accepted!")
        break  # Password is valid
    
    # Create new user
    new_user = {
        "username": username, 
        "password": password, 
        "points": 0,
        "role": "user"  
    }
    data["users"].append(new_user)
    save_data(data)
    
    print("\n" + "="*50)
    print("  ✓ ACCOUNT CREATED SUCCESSFULLY!")
    print("="*50)
    print(f"Username: {username}")
    print(f"You can now login with your credentials.")
    print("="*50)
    pause()
    return True

# --- Main User Features ---

def view_cities(data):
    print_header("TOURIST CITIES")
    
    city_list = data["cities"]
    for i in range(len(city_list)):
        city = city_list[i]
        print(f"\n{i+1}. {city['name']} ({city['type']})")
        print(f"   {city['description']}")
        print(f"   Rating: {'⭐' * int(city['rating'])} ({city['rating']}/5)")
    
    pause()

def view_hotels(data):
    print_header("AVAILABLE HOTELS")
    
    hotels = data["hotels"]
    
    if len(hotels) == 0:
        print("\nNo hotels available!")
        pause()
        return
    
    for i in range(len(hotels)):
        hotel = hotels[i]
        print(f"\n{i+1}. {hotel['name']}")
        print(f"   Location: {hotel['city']}")
        print(f"   Price: PKR {hotel['price']} per night")
        print(f"   Rooms Available: {hotel['rooms']}")
    
    pause()

def book_hotel(data):
    global current_user
    print_header("BOOK A HOTEL")
    
    hotels = data["hotels"]
    
    if len(hotels) == 0:
        print("\nNo hotels available!")
        pause()
        return
    
    # Show available hotels
    available_count = 0
    for i in range(len(hotels)):
        hotel = hotels[i]
        if hotel['rooms'] > 0:
            print(f"{i+1}. {hotel['name']} - {hotel['city']} (PKR {hotel['price']}/night) - {hotel['rooms']} rooms")
            available_count = available_count + 1
    
    if available_count == 0:
        print("\nNo rooms available in any hotel!")
        pause()
        return
    
    choice = input("\nEnter hotel number (or 0 to cancel): ")
    
    if choice == "0":
        return
    
    choice = int(choice)
    
    if choice < 1 or choice > len(hotels):
        print("Invalid choice!")
        pause()
        return
    
    selected_hotel = hotels[choice - 1]
    
    if selected_hotel['rooms'] == 0:
        print("\nSorry, no rooms available!")
        pause()
        return
    
    # Get booking details
    nights = int(input("How many nights? "))
    guests = int(input("Number of guests? "))
    num_rooms = int(input(f"Number of rooms (max {selected_hotel['rooms']}): "))
    
    # Validate room count
    if num_rooms > selected_hotel['rooms']:
        print(f"\nOnly {selected_hotel['rooms']} rooms available!")
        pause()
        return
    
    if num_rooms < 1:
        print("\nMust book at least 1 room!")
        pause()
        return
    
    # Calculate cost
    total_cost = selected_hotel['price'] * nights * num_rooms
    original_cost = total_cost
    
    print(f"\n--- Booking Summary ---")
    print(f"Hotel: {selected_hotel['name']}")
    print(f"City: {selected_hotel['city']}")
    print(f"Nights: {nights}")
    print(f"Guests: {guests}")
    print(f"Rooms: {num_rooms}")
    print(f"Base Price: PKR {total_cost}")
    
    # Group booking discount (5+ rooms get 15% off)
    group_discount = 0
    if num_rooms >= 5:
        group_discount = int(total_cost * 0.15)
        total_cost = total_cost - group_discount
        print(f"\n🎉 Group Discount (15%): -PKR {group_discount}")
    
    # Promo code
    promo_discount = 0
    use_promo = input("\nDo you have a promo code? (y/n): ")
    if use_promo == "y":
        promo_code = input("Enter promo code: ").upper()
        
        for promo in data["promo_codes"]:
            if promo["code"] == promo_code:
                promo_discount = int(total_cost * (promo["discount"] / 100))
                total_cost = total_cost - promo_discount
                print(f"✓ Promo '{promo_code}' Applied ({promo['discount']}%): -PKR {promo_discount}")
                break
        
        if promo_discount == 0:
            print("✗ Invalid promo code!")
    
    # Loyalty points discount
    loyalty_discount = 0
    if current_user['points'] > 0:
        print(f"\nYou have {current_user['points']} loyalty points!")
        show_progress_bar(current_user['points'])
        use_points = input("\nUse points for discount? (y/n): ")
        
        if use_points == "y":
            loyalty_discount = current_user['points']
            if loyalty_discount > total_cost:
                loyalty_discount = total_cost
            
            total_cost = total_cost - loyalty_discount
            current_user['points'] = current_user['points'] - loyalty_discount
            print(f"✓ Loyalty Discount: -PKR {loyalty_discount}")
    
    print(f"\n{'='*30}")
    print(f"Original Price: PKR {original_cost}")
    if group_discount > 0:
        print(f"Group Discount: -PKR {group_discount}")
    if promo_discount > 0:
        print(f"Promo Discount: -PKR {promo_discount}")
    if loyalty_discount > 0:
        print(f"Loyalty Discount: -PKR {loyalty_discount}")
    print(f"{'='*30}")
    print(f"FINAL PRICE: PKR {total_cost}")
    print(f"{'='*30}")
    
    confirm = input("\nConfirm booking? (y/n): ")
    
    if confirm == "y":
        # Create booking
        booking = {
            "username": current_user['username'],
            "hotel": selected_hotel['name'],
            "city": selected_hotel['city'],
            "nights": nights,
            "guests": guests,
            "rooms": num_rooms,
            "cost": total_cost
        }
        data["bookings"].append(booking)
        
        # Reduce available rooms
        selected_hotel['rooms'] = selected_hotel['rooms'] - num_rooms
        
        # Add loyalty points (10 points per night per room)
        earned = nights * num_rooms * 10
        current_user['points'] = current_user['points'] + earned
        
        # Update user in data
        for i in range(len(data["users"])):
            if data["users"][i]["username"] == current_user["username"]:
                data["users"][i] = current_user
                break
        
        # Save to file
        save_data(data)
        
        print("\n" + "="*40)
        print("   ✓ BOOKING CONFIRMED!")
        print("="*40)
        print(f"Booking ID: #{len(data['bookings'])}")
        print(f"Customer: {current_user['username']}")
        print(f"Hotel: {selected_hotel['name']}")
        print(f"City: {selected_hotel['city']}")
        print(f"Nights: {nights} | Guests: {guests} | Rooms: {num_rooms}")
        print(f"Total Paid: PKR {total_cost}")
        print(f"\n🎁 You earned {earned} loyalty points!")
        show_progress_bar(current_user['points'])
        print("="*40)
        print("Thank you for booking with us!")
        print("="*40)
    else:
        print("Booking cancelled.")
    
    pause()

def my_bookings(data):
    print_header("MY BOOKINGS")
    
    found = False
    booking_num = 0
    
    for booking in data["bookings"]:
        if booking['username'] == current_user['username']:
            booking_num = booking_num + 1
            print(f"\n--- Booking #{booking_num} ---")
            print(f"Hotel: {booking['hotel']}")
            print(f"City: {booking['city']}")
            print(f"Nights: {booking['nights']} | Guests: {booking['guests']} | Rooms: {booking['rooms']}")
            print(f"Cost: PKR {booking['cost']}")
            found = True
    
    if found == False:
        print("\nNo bookings yet!")
    
    pause()

def cancel_booking(data):
    print_header("CANCEL BOOKING")
    
    user_bookings = []
    for i in range(len(data["bookings"])):
        if data["bookings"][i]['username'] == current_user['username']:
            user_bookings.append(i)
    
    if len(user_bookings) == 0:
        print("No bookings to cancel!")
        pause()
        return
    
    print("\nYour bookings:")
    for i in range(len(user_bookings)):
        booking_index = user_bookings[i]
        booking = data["bookings"][booking_index]
        print(f"{i+1}. {booking['hotel']} - {booking['city']} ({booking['rooms']} rooms) - PKR {booking['cost']}")
    
    choice = input("\nEnter booking number to cancel (or 0 to go back): ")
    
    if choice == "0":
        return
    
    choice = int(choice)
    
    if choice < 1 or choice > len(user_bookings):
        print("Invalid choice!")
        pause()
        return
    
    booking_index = user_bookings[choice - 1]
    cancelled = data["bookings"][booking_index]
    
    # Return rooms
    for hotel in data["hotels"]:
        if hotel['name'] == cancelled['hotel']:
            hotel['rooms'] = hotel['rooms'] + cancelled['rooms']
            break
    
    data["bookings"].pop(booking_index)
    save_data(data)
    
    print("\n✓ Booking cancelled successfully!")
    print(f"Refund: PKR {cancelled['cost']}")
    pause()

def get_recommendation(data):
    print_header("TRAVEL RECOMMENDATION")
    print("\nWhat type of place do you prefer?")
    print("1. Cold/Mountain")
    print("2. Beach/Sea")
    print("3. City/Urban")
    
    choice = input("\nYour choice (1-3): ")
    
    if choice == "1":
        pref = "Cold"
    elif choice == "2":
        pref = "Beach"
    elif choice == "3":
        pref = "City"
    else:
        print("Invalid choice!")
        pause()
        return
    
    print(f"\n✨ Recommended {pref} destinations:")
    
    found = False
    for city in data["cities"]:
        if city['type'] == pref:
            print(f"\n• {city['name']}")
            print(f"  {city['description']}")
            print(f"  Rating: {city['rating']}/5 {'⭐' * int(city['rating'])}")
            found = True
    
    if found == False:
        print(f"\nNo {pref} destinations available!")
    
    pause()

def weather_info():
    print_header("WEATHER FORECAST")
    print("\nCurrent weather conditions:\n")
    
    weather = [
        {"city": "Swat", "temp": "15°C", "condition": "Cloudy ☁️"},
        {"city": "Karachi", "temp": "28°C", "condition": "Sunny ☀️"},
        {"city": "Murree", "temp": "8°C", "condition": "Snowy ❄️"},
        {"city": "Lahore", "temp": "25°C", "condition": "Clear 🌤️"},
        {"city": "Hunza", "temp": "10°C", "condition": "Partly Cloudy ⛅"}
    ]
    
    for w in weather:
        print(f"{w['city']:12} {w['temp']:8} {w['condition']}")
    
    pause()

def top_destinations(data):
    print_header("TOP RATED DESTINATIONS")
    
    sorted_cities = data["cities"].copy()
    
    # Simple bubble sort by rating
    for i in range(len(sorted_cities)):
        for j in range(len(sorted_cities) - 1):
            if sorted_cities[j]['rating'] < sorted_cities[j+1]['rating']:
                temp = sorted_cities[j]
                sorted_cities[j] = sorted_cities[j+1]
                sorted_cities[j+1] = temp
    
    print("\n🏆 Most Popular Destinations:\n")
    
    for i in range(len(sorted_cities)):
        city = sorted_cities[i]
        print(f"{i+1}. {city['name']} - {city['rating']}⭐")
        print(f"   {city['description']}")
        print()
    
    pause()

def view_promo_codes(data):
    print_header("AVAILABLE PROMO CODES")
    
    if len(data["promo_codes"]) == 0:
        print("\nNo promo codes available!")
    else:
        print("\n🎟️ Active Promo Codes:\n")
        for promo in data["promo_codes"]:
            print(f"• {promo['code']} - {promo['discount']}% OFF")
    
    pause()

# --- ADMIN FEATURES ---

def add_hotel(data):
    print_header("ADD NEW HOTEL")
    
    name = input("Hotel Name: ")
    
    # Show available cities
    print("\nAvailable Cities:")
    for i in range(len(data["cities"])):
        print(f"{i+1}. {data['cities'][i]['name']}")
    
    city_choice = input("\nSelect city number: ")
    city_choice = int(city_choice)
    
    if city_choice < 1 or city_choice > len(data["cities"]):
        print("Invalid city!")
        pause()
        return
    
    city = data["cities"][city_choice - 1]["name"]
    try:
        price = int(input("Price per night (PKR): "))
    except ValueError:
        print("Invalid price! Must be a number.")
        pause()
        return

    if price < 0:
        print("Price cannot be negative!")
        pause()
        return

    try:
        rooms = int(input("Number of rooms: "))
    except ValueError:
        print("Invalid room count! Must be an integer.")
        pause()
        return

    if rooms < 0:
        print("Number of rooms cannot be negative!")
        pause()
        return
    
    new_hotel = {
        "name": name,
        "city": city,
        "price": price,
        "rooms": rooms
    }
    
    data["hotels"].append(new_hotel)
    save_data(data)
    
    print(f"\n✓ Hotel '{name}' added successfully!")
    pause()

def edit_hotel(data):
    print_header("EDIT HOTEL")
    
    hotels = data["hotels"]
    
    if len(hotels) == 0:
        print("\nNo hotels to edit!")
        pause()
        return
    
    print("\nSelect hotel to edit:")
    for i in range(len(hotels)):
        print(f"{i+1}. {hotels[i]['name']} - {hotels[i]['city']}")
    
    choice = input("\nEnter hotel number: ")
    choice = int(choice)
    
    if choice < 1 or choice > len(hotels):
        print("Invalid choice!")
        pause()
        return
    
    hotel = hotels[choice - 1]
    
    print(f"\nEditing: {hotel['name']}")
    print("Leave blank to keep current value")
    
    new_name = input(f"New name [{hotel['name']}]: ")
    if new_name:
        hotel['name'] = new_name
    
    new_price = input(f"New price [{hotel['price']}]: ")
    if new_price:
        try:
            p = int(new_price)
        except ValueError:
            print("Invalid price! Must be a number.")
            pause()
            return

        if p < 0:
            print("Price cannot be negative!")
            pause()
            return

        hotel['price'] = p
    
    new_rooms = input(f"New rooms [{hotel['rooms']}]: ")
    if new_rooms:
        try:
            r = int(new_rooms)
        except ValueError:
            print("Invalid room count! Must be an integer.")
            pause()
            return

        if r < 0:
            print("Number of rooms cannot be negative!")
            pause()
            return

        hotel['rooms'] = r
    
    save_data(data)
    print("\n✓ Hotel updated successfully!")
    pause()

def delete_hotel(data):
    print_header("DELETE HOTEL")
    
    hotels = data["hotels"]
    
    if len(hotels) == 0:
        print("\nNo hotels to delete!")
        pause()
        return
    
    print("\nSelect hotel to delete:")
    for i in range(len(hotels)):
        print(f"{i+1}. {hotels[i]['name']} - {hotels[i]['city']}")
    
    choice = input("\nEnter hotel number: ")
    choice = int(choice)
    
    if choice < 1 or choice > len(hotels):
        print("Invalid choice!")
        pause()
        return
    
    hotel = hotels[choice - 1]
    confirm = input(f"\nDelete '{hotel['name']}'? (y/n): ")
    
    if confirm == "y":
        hotels.pop(choice - 1)
        save_data(data)
        print("\n✓ Hotel deleted successfully!")
    else:
        print("Deletion cancelled.")
    
    pause()

def manage_rooms(data):
    print_header("MANAGE ROOM AVAILABILITY")
    
    hotels = data["hotels"]
    
    if len(hotels) == 0:
        print("\nNo hotels available!")
        pause()
        return
    
    print("\nCurrent Room Status:")
    for i in range(len(hotels)):
        print(f"{i+1}. {hotels[i]['name']} - {hotels[i]['rooms']} rooms available")
    
    choice = input("\nSelect hotel to update rooms: ")
    choice = int(choice)
    
    if choice < 1 or choice > len(hotels):
        print("Invalid choice!")
        pause()
        return
    
    hotel = hotels[choice - 1]
    
    print(f"\nCurrent rooms for {hotel['name']}: {hotel['rooms']}")
    try:
        new_rooms = int(input("Enter new room count: "))
    except ValueError:
        print("Invalid room count! Must be an integer.")
        pause()
        return

    if new_rooms < 0:
        print("Number of rooms cannot be negative!")
        pause()
        return

    hotel['rooms'] = new_rooms
    save_data(data)
    
    print(f"\n✓ Room count updated to {new_rooms}!")
    pause()

def add_city(data):
    print_header("ADD NEW CITY")
    
    name = input("City Name: ")
    
    print("\nCity Type:")
    print("1. Cold/Mountain")
    print("2. Beach/Sea")
    print("3. City/Urban")
    
    type_choice = input("Select type (1-3): ")
    
    if type_choice == "1":
        city_type = "Cold"
    elif type_choice == "2":
        city_type = "Beach"
    elif type_choice == "3":
        city_type = "City"
    else:
        print("Invalid choice!")
        pause()
        return
    
    description = input("Description: ")
    rating = float(input("Rating (0-5): "))
    
    if rating < 0 or rating > 5:
        print("Rating must be between 0 and 5!")
        pause()
        return
    
    new_city = {
        "name": name,
        "type": city_type,
        "description": description,
        "rating": rating
    }
    
    data["cities"].append(new_city)
    save_data(data)
    
    print(f"\n✓ City '{name}' added successfully!")
    pause()

def edit_city(data):
    print_header("EDIT CITY")
    
    cities_list = data["cities"]
    
    if len(cities_list) == 0:
        print("\nNo cities to edit!")
        pause()
        return
    
    print("\nSelect city to edit:")
    for i in range(len(cities_list)):
        print(f"{i+1}. {cities_list[i]['name']}")
    
    choice = input("\nEnter city number: ")
    choice = int(choice)
    
    if choice < 1 or choice > len(cities_list):
        print("Invalid choice!")
        pause()
        return
    
    city = cities_list[choice - 1]
    
    print(f"\nEditing: {city['name']}")
    print("Leave blank to keep current value")
    
    new_name = input(f"New name [{city['name']}]: ")
    if new_name:
        city['name'] = new_name
    
    new_desc = input(f"New description [{city['description']}]: ")
    if new_desc:
        city['description'] = new_desc
    
    new_rating = input(f"New rating [{city['rating']}]: ")
    if new_rating:
        city['rating'] = float(new_rating)
    
    save_data(data)
    print("\n✓ City updated successfully!")
    pause()

def create_promo_code(data):
    print_header("CREATE PROMO CODE")
    
    code = input("Promo Code (e.g., SUMMER25): ").upper()
    
    # Check if code already exists
    for promo in data["promo_codes"]:
        if promo["code"] == code:
            print("\n✗ This promo code already exists!")
            pause()
            return
    
    discount = int(input("Discount percentage (e.g., 25): "))
    
    if discount < 1 or discount > 100:
        print("Discount must be between 1 and 100!")
        pause()
        return
    
    new_promo = {
        "code": code,
        "discount": discount
    }
    
    data["promo_codes"].append(new_promo)
    save_data(data)
    
    print(f"\n✓ Promo code '{code}' created with {discount}% discount!")
    pause()

def manage_promo_codes(data):
    print_header("MANAGE PROMO CODES")
    
    if len(data["promo_codes"]) == 0:
        print("\nNo promo codes available!")
        print("\n1. Create New Promo Code")
        print("2. Go Back")
        
        choice = input("\nChoice: ")
        if choice == "1":
            create_promo_code(data)
        return
    
    print("\nExisting Promo Codes:")
    for i in range(len(data["promo_codes"])):
        promo = data["promo_codes"][i]
        print(f"{i+1}. {promo['code']} - {promo['discount']}% OFF")
    
    print("\n1. Create New Promo Code")
    print("2. Delete Promo Code")
    print("3. Go Back")
    
    choice = input("\nChoice: ")
    
    if choice == "1":
        create_promo_code(data)
    elif choice == "2":
        del_choice = int(input("\nEnter promo number to delete: "))
        if del_choice >= 1 and del_choice <= len(data["promo_codes"]):
            deleted = data["promo_codes"].pop(del_choice - 1)
            save_data(data)
            print(f"\n✓ Promo code '{deleted['code']}' deleted!")
            pause()
        else:
            print("Invalid choice!")
            pause()

def view_all_bookings(data):
    print_header("ALL BOOKINGS")
    
    if len(data["bookings"]) == 0:
        print("\nNo bookings in system!")
    else:
        for i in range(len(data["bookings"])):
            booking = data["bookings"][i]
            print(f"\n--- Booking #{i+1} ---")
            print(f"User: {booking['username']}")
            print(f"Hotel: {booking['hotel']} ({booking['city']})")
            print(f"Nights: {booking['nights']} | Guests: {booking['guests']} | Rooms: {booking['rooms']}")
            print(f"Cost: PKR {booking['cost']}")
    
    pause()

def delete_booking(data):
    print_header("DELETE BOOKING (ADMIN)")
    
    if len(data["bookings"]) == 0:
        print("\nNo bookings to delete!")
        pause()
        return
    
    print("\nAll Bookings:")
    for i in range(len(data["bookings"])):
        booking = data["bookings"][i]
        print(f"{i+1}. {booking['username']} - {booking['hotel']} ({booking['rooms']} rooms) - PKR {booking['cost']}")
    
    choice = input("\nEnter booking number to delete: ")
    choice = int(choice)
    
    if choice < 1 or choice > len(data["bookings"]):
        print("Invalid choice!")
        pause()
        return
    
    cancelled = data["bookings"][choice - 1]
    
    # Return rooms
    for hotel in data["hotels"]:
        if hotel['name'] == cancelled['hotel']:
            hotel['rooms'] = hotel['rooms'] + cancelled['rooms']
            break
    
    data["bookings"].pop(choice - 1)
    save_data(data)
    
    print("\n✓ Booking deleted successfully!")
    pause()

def view_analytics(data):
    print_header("SYSTEM ANALYTICS")
    
    bookings = data["bookings"]
    total_bookings = len(bookings)
    
    total_revenue = 0
    total_rooms_booked = 0
    
    for booking in bookings:
        total_revenue = total_revenue + booking["cost"]
        total_rooms_booked = total_rooms_booked + booking["rooms"]
    
    print(f"\n📊 BUSINESS METRICS")
    print(f"{'='*40}")
    print(f"Total Bookings: {total_bookings}")
    print(f"Total Revenue: PKR {total_revenue}")
    print(f"Total Rooms Booked: {total_rooms_booked}")
    print(f"Total Users: {len(data['users'])}")
    print(f"Total Hotels: {len(data['hotels'])}")
    print(f"Total Cities: {len(data['cities'])}")
    print(f"Active Promo Codes: {len(data['promo_codes'])}")
    
    if total_bookings > 0:
        avg_booking = int(total_revenue / total_bookings)
        print(f"Average Booking Value: PKR {avg_booking}")
    
    print(f"\n{'='*40}")
    
    if total_bookings > 0:
        # City popularity
        city_counts = {}
        for booking in bookings:
            city = booking["city"]
            if city in city_counts:
                city_counts[city] = city_counts[city] + 1
            else:
                city_counts[city] = 1
        
        print(f"\n🌍 CITY POPULARITY")
        print(f"{'='*40}")
        for city in city_counts:
            percentage = int((city_counts[city] / total_bookings) * 100)
            print(f"{city}: {city_counts[city]} bookings ({percentage}%)")
        
        # Hotel popularity
        hotel_counts = {}
        for booking in bookings:
            hotel = booking["hotel"]
            if hotel in hotel_counts:
                hotel_counts[hotel] = hotel_counts[hotel] + 1
            else:
                hotel_counts[hotel] = 1
        
        print(f"\n🏨 HOTEL POPULARITY")
        print(f"{'='*40}")
        for hotel in hotel_counts:
            percentage = int((hotel_counts[hotel] / total_bookings) * 100)
            print(f"{hotel}: {hotel_counts[hotel]} bookings ({percentage}%)")
    
    pause()

def view_all_users(data):
    print_header("ALL USERS")
    
    print(f"\nTotal Users: {len(data['users'])}\n")
    print(f"{'Username':<20} {'Loyalty Points':<15}")
    print("="*40)
    
    for user in data["users"]:
        if user['username'] != "admin":
            print(f"{user['username']:<20} {user['points']:<15}")
    
    pause()

def create_admin_account(data):
    """Admin function to create new admin accounts"""
    print_header("CREATE ADMIN ACCOUNT")
    print("(Enter '0' as username to go back)\n")
    
    # Ask for username until valid
    while True:
        username = input("New Admin Username (min 3 characters): ")
        
        # Allow cancel
        if username == "0":
            return
        
        # Validate length
        if len(username) < 3:
            print("✗ Username must be at least 3 characters! Try again.")
            continue
        
        # Check if username already exists
        username_exists = False
        for user in data["users"]:
            if user["username"] == username:
                username_exists = True
                break
        
        if username_exists:
            print("✗ Username already taken! Try another one.")
        else:
            break  # Username is valid
    
    # Ask for password until valid
    while True:
        password = input("Admin Password (min 4 characters): ")
        
        if len(password) < 4:
            print("✗ Password must be at least 4 characters! Try again.")
        else:
            break  # Password is valid
    
    # Create new admin
    new_admin = {
        "username": username,
        "password": password,
        "points": 0,
        "role": "admin"
    }
    
    data["users"].append(new_admin)
    save_data(data)
    
    print("\n" + "="*40)
    print(f"✓ Admin account '{username}' created successfully!")
    print("="*40)
    print(f"Username: {username}")
    print(f"Role: Admin")
    print(f"They can now login with admin privileges.")
    print("="*40)
    pause()

#USER ROLE MANAGEMENT
def manage_user_roles(data):
    """Change existing user roles between admin and user"""
    print_header("MANAGE USER ROLES")
    
    if len(data["users"]) == 0:
        print("\nNo users in system!")
        pause()
        return
    
    print("\nAll Users:")
    print(f"{'#':<5} {'Username':<20} {'Role':<10} {'Points':<10}")
    print("="*50)
    
    for i in range(len(data["users"])):
        user = data["users"][i]
        print(f"{i+1:<5} {user['username']:<20} {user['role']:<10} {user['points']:<10}")
    
    print("\n0. Go Back")
    choice = input("\nEnter user number to change role: ")
    
    if choice == "0":
        return
    
    choice = int(choice)
    
    if choice < 1 or choice > len(data["users"]):
        print("Invalid choice!")
        pause()
        return
    
    selected_user = data["users"][choice - 1]
    
    print(f"\nSelected User: {selected_user['username']}")
    print(f"Current Role: {selected_user['role']}")
    
    print("\n1. Make Admin")
    print("2. Make Regular User")
    print("3. Cancel")
    
    role_choice = input("\nChoice: ")
    
    if role_choice == "1":
        if selected_user['role'] == "admin":
            print(f"\n✗ {selected_user['username']} is already an admin!")
        else:
            selected_user['role'] = "admin"
            save_data(data)
            print(f"\n✓ {selected_user['username']} is now an admin!")
    
    elif role_choice == "2":
        if selected_user['role'] == "user":
            print(f"\n✗ {selected_user['username']} is already a regular user!")
        else:
            selected_user['role'] = "user"
            save_data(data)
            print(f"\n✓ {selected_user['username']} is now a regular user!")
    
    pause()

# --- User Menu ---

def user_menu(data):
    while True:
        clear_screen()
        print_header(f"Welcome, {current_user['username']}!")
        print(f"💰 Loyalty Points: {current_user['points']}")
        show_progress_bar(current_user['points'])
        
        print("\n--- EXPLORE ---")
        print("1. View Cities")
        print("2. View Hotels")
        print("3. Top Destinations")
        print("4. Weather Forecast")
        
        print("\n--- BOOKING ---")
        print("5. Book Hotel")
        print("6. My Bookings")
        print("7. Cancel Booking")
        
        print("\n--- RECOMMENDATIONS ---")
        print("8. Get Travel Recommendation")
        print("9. View Promo Codes")
        
        print("\n10. Logout")
        
        choice = input("\nEnter your choice: ")
        
        if choice == "1":
            view_cities(data)
        elif choice == "2":
            view_hotels(data)
        elif choice == "3":
            top_destinations(data)
        elif choice == "4":
            weather_info()
        elif choice == "5":
            book_hotel(data)
        elif choice == "6":
            my_bookings(data)
        elif choice == "7":
            cancel_booking(data)
        elif choice == "8":
            get_recommendation(data)
        elif choice == "9":
            view_promo_codes(data)
        elif choice == "10":
            print("\nLogging out...")
            pause()
            break
        else:
            print("\n✗ Invalid choice!")
            pause()

def admin_menu(data):
    while True:
        clear_screen()
        print_header("ADMIN CONTROL PANEL")
        
        print("\n--- HOTEL MANAGEMENT ---")
        print("1. Add New Hotel")
        print("2. Edit Hotel")
        print("3. Delete Hotel")
        print("4. Manage Room Availability")
        
        print("\n--- CITY MANAGEMENT ---")
        print("5. Add New City")
        print("6. Edit City")
        
        print("\n--- PROMO CODE MANAGEMENT ---")
        print("7. Manage Promo Codes")
        
        print("\n--- BOOKING MANAGEMENT ---")
        print("8. View All Bookings")
        print("9. Delete Booking")
        
        print("\n--- REPORTS & ANALYTICS ---")
        print("10. View Analytics")
        print("11. View All Users")
        
        print("\n--- ADMIN MANAGEMENT ---")
        print("12. Create Admin Account")
        print("13. Manage User Roles")
        
        print("\n14. Logout")
        
        choice = input("\nEnter your choice: ")
        
        if choice == "1":
            add_hotel(data)
        elif choice == "2":
            edit_hotel(data)
        elif choice == "3":
            delete_hotel(data)
        elif choice == "4":
            manage_rooms(data)
        elif choice == "5":
            add_city(data)
        elif choice == "6":
            edit_city(data)
        elif choice == "7":
            manage_promo_codes(data)
        elif choice == "8":
            view_all_bookings(data)
        elif choice == "9":
            delete_booking(data)
        elif choice == "10":
            view_analytics(data)
        elif choice == "11":
            view_all_users(data)
        elif choice == "12":
            create_admin_account(data)
            data = load_data() 
        elif choice == "13":
            manage_user_roles(data)
            data = load_data()  
        elif choice == "14":
            print("\nLogging out...")
            pause()
            break
        else:
            print("\n✗ Invalid choice!")
            pause()

# --- Main Program ---

def main():
    data = load_data()
    
    while True:
        clear_screen()
        print("="*50)
        print("     TOURISM BOOKING SYSTEM")
        print("     Institute of Data Science")
        print("     Session 2025-2029")
        print("="*50)
        print("\n1. Login")
        print("2. Sign Up")
        print("3. Exit")
        
        choice = input("\nEnter your choice: ")
        
        if choice == "1":
            if login(data):
                # Check user role instead of username
                if current_user["role"] == "admin":
                    admin_menu(data)
                else:
                    user_menu(data)
                
                data = load_data()  # Reload data after menu
                
        elif choice == "2":
            signup(data)
            data = load_data()  # Reload data after signup
            
        elif choice == "3":
            print("\n" + "="*50)
            print("  Thank you for using Tourism Booking System!")
            print("="*50)
            break
            
        else:
            print("\n✗ Invalid choice!")
            pause()

# Run the program
if __name__ == "__main__":
    main()










    #THIS IS THE ENDDDDDD