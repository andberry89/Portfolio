const fs = require('fs');
const chalk = require('chalk');

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title === title); // check to make sure the title of the new note is not already taken

    if (!duplicateNote){    // if no duplicate is found we can add the note
        notes.push({
            title: title,
            body: body
        });

        saveNotes(notes);
        console.log(chalk.bgGreen('New note added.'));

    } else {
        console.log(chalk.bgRed('Duplicate title found.'));
    }
};

const removeNote = (title) => {
    const notes = loadNotes();
    const newNotes = notes.filter((note) => note.title !== title); // create a new array of notes excluding the one we want to remove

    if (newNotes.length < notes.length){    // if the new array is shorter, then we've found a match and can save the new array
        saveNotes(newNotes);
        console.log(chalk.green.inverse('Note removed!'));
    } else {                                // if they're the same length, no action is needed because that title is not found
        console.log(chalk.red.inverse('No note found!'));
    }
}

const loadNotes = () => {   // load data from the JSON file
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

const saveNotes = (notes) => { 
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON);
};

const listNotes = () => {
    const notes = loadNotes();
    console.log(chalk.blue.inverse('Your notes'));
    notes.forEach((note) => {
        console.log(note.title);
    });
    
};

const readNote = (title) => {
    const notes = loadNotes();
    const note = notes.find((note) => note.title === title);

    if(note) {
        console.log(chalk.blue.inverse(note.title));
        console.log(note.body);
    }
    else {
        console.log(chalk.red.inverse('No note found'));
    }
};

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};