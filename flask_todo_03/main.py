from flask import Flask, request, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

# init app with active module name (__name__) as arg.
# create the db connection string
# pass it as URI db address and run sqlalchemy
app = Flask(__name__)
project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "todo.db"))
app.config["SQLALCHEMY_DATABASE_URI"] = database_file
db = SQLAlchemy(app)


# define a db model :
# create a Note table, with automatic id, text as todo task
# boolean holding the done value,
# and an automatic date holding the creation time
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text)
    done = db.Column(db.Boolean)
    dateAdded = db.Column(db.DateTime, default=datetime.now())


# CRUD API -> create 4 methods -> create, read, update and delete
# ---
# create a New note and pass text as a param
# save it in the db
def create_note(text):
    note = Note(text=text)
    db.session.add(note)
    db.session.commit()
    db.session.refresh(note)


# list all Note records from db
def read_notes():
    return db.session.query(Note).all()


# text of the task and value of the checkbox
# True if on, else False
def update_note(note_id, text, done):
    db.session.query(Note).filter_by(id=note_id).update(
        {"text": text, "done": True if done == "on" else False}
    )
    db.session.commit()


# delete note by id
def delete_note(note_id):
    db.session.query(Note).filter_by(id=note_id).delete()
    db.session.commit()


# Home page -> add and display records
# endpoint defined with @app.route decorator
# first param -> relative URL
# second param -> request methods POST & GET for form processing
# The POST method sends a form with a newly created task
# Whether GET or POST, display the html template and pass to
# the Jinja template system the tasks stored in db (read_notes).
@app.route("/", methods=["POST", "GET"])
def home():
    if request.method == "POST":
        create_note(request.form["text"])
    return render_template("index.html", notes=read_notes())


# Edit & delete
# specify the relative address of the endpoint
# and pass a param note_id via URL to the edit_note method
# if input request = POST, pass the input form to the update_note fn
# to modify the task.
# if request = GET, delete the given task
# when done, redirect everything to the original page
@app.route("/edit/<note_id>", methods=["POST", "GET"])
def edit_note(note_id):
    if request.method == "POST":
        update_note(note_id, text=request.form["text"], done=request.form["done"])
    elif request.method == "GET":
        delete_note(note_id)
    return redirect("/", code=302)


# create a database with specified tables (Note)
# run the flask app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
