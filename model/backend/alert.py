from flask import Flask, Response
import cv2
from ultralytics import YOLO
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import winsound
from playsound import playsound

app = Flask(__name__)

# Load YOLO model
model = YOLO("yolov8n.pt")

# Video capture
cap = cv2.VideoCapture(0)  # Change to 0 for built-in cam

# Thresholds
CROWD_THRESHOLD = 40000  # Adjust as needed
EMAIL_COOLDOWN = 60  # seconds
last_email_time = 0

# Email setup
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "221801007@rajalakshmi.edu.in"
EMAIL_PASSWORD = "ufun rzhf sdzy srtv"  # App password
EMAIL_RECEIVER = "221801005@rajalakshmi.edu.in"

def send_email_alert(count):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECEIVER
        msg["Subject"] = "🚨 Crowd Alert: High Density Detected!"
        body = f"⚠️ Warning! Crowd size exceeded threshold. Detected {count} people."
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        server.quit()
        print("✅ Email alert sent successfully!")

    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def play_alert_sound():
    print("🔊 Playing loud alert sound...")
    try:
        playsound("loud_alarm.mp3")
    except:
        print("❌ Alarm file missing! Using beep sound instead.")
        start_time = time.time()
        while time.time() - start_time < 15:
            winsound.Beep(3000, 500)

def generate_frames():
    global last_email_time

    while True:
        success, frame = cap.read()
        if not success:
            break

        # Run detection
        results = model(frame)
        person_count = sum(1 for obj in results[0].boxes.cls if obj == 0)

        # Annotate frame
        annotated_frame = results[0].plot(line_width=1)
        cv2.putText(annotated_frame, f"People Count: {person_count}", (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        # Check for alert
        if person_count > CROWD_THRESHOLD:
            current_time = time.time()
            if current_time - last_email_time > EMAIL_COOLDOWN:
                print(f"⚠️ Crowd limit exceeded! Detected {person_count} people.")
                send_email_alert(person_count)
                play_alert_sound()
                last_email_time = current_time

        # Encode and yield frame
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def home():
    return "<h2>YOLO Crowd Detection Stream Available at <a href='/video'>/video</a></h2>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
