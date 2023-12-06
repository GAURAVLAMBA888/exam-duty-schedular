# Exam Duty Scheduler

## Tech stack used

- React (javascript)

## How to Start the App

Steps :-
1. Clone the repo.
2. Install dependencies
3. Enter npm start to start the app.


## Commands Used

  

- Create a react app -> npx create-react-app app-name

- install xlsx -> npm install xlsx

- install react-dropzone -> npm install react-dropzone

  
## Input and output file Type
While uploading the excel file it is mandatory to upload file with only .xlsx extension

- Input file type -> (example_input).xlsx

- Output file type -> (example_output).xlsx

## Input at Web-Page 

- Start time --> It is Start Time of Exam from (1 to 24) in 24 Hrs Format

- Exam-duration --> Exam Duration in hrs only 1, 2 and 3 is allowed as input

- Semester --> Semesters whose exams are going on. Can pass multiple values seperated by commas or a single value. for eg. 1,3,4 means 1st, 3rd and 4th semesters exams are going on.

- Teachers required --> Number of teachers required for invigilation duty.

- Day --> On Which weekday exam will be held. Input format allowed are - MON , TUE , WED , THU , FRI , SAT

  

## Input File Format

The Input File must have following attributes (case sensitive) :
1. name - Name of the teachers
2. phone - Phone No. of teacher
3. day - Week Day such as MON, TUE, WED, THU, FRI
4. 8 - Class from 8 to 9 in the format ***x,y,z,semester*** . eg.CSE-8,STW,C-LH-201,2nd
5. 9 - Class from 9-10 <br>
and so on upto 17 and if there is no class at any time then that particular cell must have "X".

  
  
  

## Output File Format
The Output will have teacher's list with increasing order of their load i.e. the teacher at top will have minimum load on that day.
Output File Contains two columns :-
1. name - Name of teacher
2. phone - Phone No. of Teacher
