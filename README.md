# Family Fortune Game

I created a quick little game of family fortunes and wanted to share the game and code in case anyone wanted to use it.

## How to Play
### Online Version
The game is available online at https://matloughnane.github.io/family-fortune-game/

The answers for the game (should only be read by the 'host') are here: https://github.com/matloughnane/family-fortune-game/blob/master/assets/js/data.js

The easiest way we've found to play the game was to share the website on screen and have the host view the answers file on another.

If a player get's an answer correct, the host can click the answer or the corresponding number on their keyboard.
If a player get's it wrong, the host can click the wrong button or click the "x" key on their keyboard.
If all 3 wrong answers are exhausted they can reset the wrong answer counter with the other red button.

### Customising your quiz
Click **Settings** in the bottom-left corner of the title screen to edit the quiz in your browser. You can:
- change the title and subtitle
- add, delete and reorder rounds
- edit each round's name, question, answers and points (up to 9 answers per round, one for each number key)

Click **Save** and the game uses your quiz straight away. **Reset to default** goes back to the built-in quiz.

Your edits are saved in this browser on this computer only. To use them somewhere else:
- **Export** saves the quiz as a file, and **Import** loads it on another computer or browser.
- **Download as data.js** gives you a file to replace `assets/js/data.js` with, which makes your quiz the built-in one (for your offline copy or your own GitHub fork).

Note: Safari may not allow saving when the game is opened from a downloaded folder. Export and Download as data.js still work there.

### Offline Version
Alternatively if you wish to customise the game you can download the game using this [link](https://github.com/matloughnane/family-fortune-game/archive/master.zip)

You can use the Settings page (see above), or edit the file at: `assets/js/data.js`

Note: this file contains all the answers, titles of the quiz and the names of the rounds in JSON format.

To run locally, you can simply open the index.html file in your browser and play.

## To Be Completed
[ ] Instructions for Dockerfile
