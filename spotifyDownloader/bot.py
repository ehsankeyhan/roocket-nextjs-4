import telegram
from telegram import ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import CommandHandler, MessageHandler, Filters, Updater
import requests
import arrow

def convert_to_farsi_num(num):
    mapping = {'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'}
    return ''.join(mapping.get(char, char) for char in str(num))

# Telegram Bot token
TOKEN = "5864558551:AAGykt-wZ1_cAIqjwsIhD3EkTOgoTpivvgY"

# Create an instance of the Telegram bot
bot = telegram.Bot(token=TOKEN)

import csv

with open('cookie.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    cookies = {}
    for row in reader:
        cookies[row[0]] = row[1]

_list = {}
servers = {}
url_options = {}
for key in cookies.keys():
    url = 'http://%sh.giftomo.net:44445/xui/inbound/update/' % key
    url_options[url+"%s"] = cookies[key]
    servers[key] = url+"%s"
    _list[key] = 'http://%sh.giftomo.net:44445/xui/inbound/list' % key

# Handler for the /start command
def start(update, context):
    # Define the menu options
    menu_options = [["📊🕐 استفاده و انقضا"]]

    # Create a list of KeyboardButton objects for each menu option
    buttons = [[KeyboardButton(option) for option in row] for row in menu_options]

    # Create the ReplyKeyboardMarkup with the menu buttons
    reply_markup = ReplyKeyboardMarkup(buttons, resize_keyboard=True)

    # Send the menu message with the ReplyKeyboardMarkup
    context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="به گیفتومو خوش آمدید!‌ لطفا از منو زیر یک گزینه را انتخاب کنید:",
        reply_markup=reply_markup,
    )


# Handler for handling menu options
def handle_menu_option(update, context):
    # Get the selected option from the user's message
    selected_option = update.message.text

    if selected_option == "📊🕐 استفاده و انقضا":

        # Ask the user for their username
        context.bot.send_message(
            chat_id=update.effective_chat.id, text="لطفا شماره اکانت خود را با حروف کوچک وارد کنید(irn001):"
        )

        # Update the conversation state to expect the username
        context.user_data["expecting_username"] = True
    else:
        context.bot.send_message(
            chat_id=update.effective_chat.id, text="گزینه انتخاب شده قابل شناسایی نیست."
        )


def handle_username(update, context):
    # Retrieve the username from the user's message
    username = update.message.text

    # Call the API with the username to retrieve data usage
    # Make the necessary API request and process the response

    # Clear the conversation state
    context.user_data["expecting_username"] = False

    # Define the request URL
    server = ''.join(filter(str.isalpha, username))
    url = _list[server]
    print(server)
    print(url)

    # Define the request headers
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        "Host": "iry.giftomo.net:44445",
        "Origin": "http://iryh.giftomo.net:44445",
        "Content-Length": "0",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
        "Referer": "http://iryh.giftomo.net:44445/xui/inbounds",
        "Cookie": cookies[server],
        "X-Requested-With": "XMLHttpRequest",
    }

    # Send the POST request
    response = requests.post(url, headers=headers)

    # Check the response status code
    if response.status_code == 200:
        # Request was successful
        data = response.json()

        now = arrow.utcnow()

        found = {}
        for obj in data['obj']:
            if obj['remark'] == username:
                found = obj

        print(found)
        timestamp_milliseconds = int(found["expiryTime"])
        utc_date = arrow.get(timestamp_milliseconds / 1000).to('UTC')
        future_date = utc_date.to('local')

        remaining_days = (future_date - arrow.now('local')).days
        remaining_days = max(0, remaining_days)  # Ensure negative values are treated as 0
        found["expiryTime"] = remaining_days
        found["up"] = found["up"] / (1024 ** 3)
        found["down"] = found["down"] / (1024 ** 3)
        found["total"] = found["total"] / (1024 ** 3)
        found["total"] = found["total"] - int(found["up"]+found["down"])

        # Send the data usage response to the user
        context.bot.send_message(
            chat_id=update.effective_chat.id, text=f"حجم باقی‌مانده️:‌ {convert_to_farsi_num(int(found['total']))} گیگابایت\n\n روز باقی‌مانده:‌ {convert_to_farsi_num(int(found['expiryTime']))}")

# Create an Updater to handle the bot's updates
updater = Updater(bot=bot, use_context=True)

# Add command handlers
start_handler = CommandHandler("start", start)
updater.dispatcher.add_handler(start_handler)

menu_option_handler = MessageHandler(Filters.regex("^📊🕐 استفاده و انقضا$"), handle_menu_option)
updater.dispatcher.add_handler(menu_option_handler)

username_handler = MessageHandler(
    Filters.text & ~Filters.command & Filters.regex("^ir[a-zA-Z]\d+$"), handle_username
)
updater.dispatcher.add_handler(username_handler)

# Start the bot
updater.start_polling()
updater.idle()


