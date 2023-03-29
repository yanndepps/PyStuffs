from flask import Flask, request

app = Flask(__name__)

# --- retrieve any html page
def get_html(page_nmae):
    html_file = open(page_nmae + ".html")
    content = html_file.read()
    html_file.close()
    return content


# --- load and read data
def get_data():
    path = "assets/data.txt"
    with open(path, mode="r", encoding="utf-8") as f:
        lines = f.readlines()
        lines.sort()
        lines = [line.strip() for line in lines]
    return lines


# --- write data
def post_data(txt):
    path = "assets/data.txt"
    with open(path, mode="a", encoding="utf-8") as f:
        f.write(txt + "\n")
    return


# --- route -> home
@app.route("/")
def home_page():
    return get_html("templates/index")


# --- route -> write new note
@app.route("/write")
def write_note():
    new_note = get_html("templates/index")
    post = request.args.get("write")
    note = str(post).strip()
    post_data(note)
    return new_note


# --- route -> display all notes
@app.route("/notes")
def show_note():
    all_notes = get_html("templates/notes")
    datas = get_data()
    values = ""
    for data in datas:
        values += "<p>" + data + "</p>"
    return all_notes.replace("$$DATA$$", values)


# --- route -> display result for search in notes
@app.route("/search")
def search_notes():
    result_list = get_html("templates/notes")
    query = request.args.get("notes")
    datas = get_data()
    values = ""
    for data in datas:
        if data.lower().find(query.lower()) != -1:
            values += "<p>" + data + "</p>"
    if values == "":
        values = "<p>No results found !</p>"
    return result_list.replace("$$DATA$$", values)
