import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import './App.css';

function App() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [day, setDay] = useState('');
  const [semester, setSemester] = useState(1);
  const [req, setReq] = useState(1);
  const [res, setRes] = useState([]);

  const handleNumber1Change = (e) => {
    setNumber1(e.target.value);
  };

  const handleNumber2Change = (e) => {
    setNumber2(e.target.value);
  };
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  }

  const handleReq = (e) => {
    setReq(e.target.value);
  }

  const handleDay = (e) => {
    setDay(e.target.value);
  }

  const handleExcelUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet); 

      for(let i=0; i<excelData.length; i++){
        for(const property in excelData[i]){
          if(property  != "name" && property != "phone" && excelData[i][property] != "X"){
            const num = Number((excelData[i][property]).split(',')[1]?.charAt(0));
            if(num == semester){
              excelData[i][property] = "X";
            }
          }
        }
      }
      // console.log(excelData);
      const resData = [];

      const countConsecutiveX = (excelData) => {
        for (let i = 0; i < excelData.length; i++) {
          if(excelData[i].day == day){
            if(number2 == 2){
            if(excelData[i][number1] == "X" && excelData[i][(Number(number1)+1).toString()] == "X"){
              const arr = Object.values(excelData[i]);
              let count = 0;
              for(let i=0; i<arr.length; i++){
                if(arr[i] == "X"){
                  count++;
                }
              }
              resData.push({"name" : excelData[i].name, "phone" : excelData[i].phone, "FreeTime" : count});
            }
          }
          else{
            if(excelData[i][number1] == "X" && excelData[i][(Number(number1)+1).toString()] == "X" && excelData[i][(Number(number1)+2).toString()] == "X"){
              const arr = Object.values(excelData[i]);
              let count = 0;
              for(let i=0; i<arr.length; i++){
                if(arr[i] == "X"){
                  count++;
                }
              }
              resData.push({"name" : excelData[i].name, "phone" : excelData[i].phone, "FreeTime" : count});
            }
            }
          }
        }

        const sortedData = resData.slice().sort((a, b) => b.FreeTime - a.FreeTime );
        const slicedArray = sortedData.slice(0, req);
        console.log(slicedArray);
        setRes(slicedArray);
      };
      countConsecutiveX(excelData);
    };

    reader.readAsArrayBuffer(file);
    
  };

  const exportToExcel = (jsonData, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  
  return (
    <div className="App">
      <div>
        <label>
          Start-Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="number" value={number1} onChange={handleNumber1Change} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Exam-Duration &nbsp;&nbsp;
          <input type="number" value={number2} onChange={handleNumber2Change} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Semester &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="number" value={semester} onChange={handleSemesterChange} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Teachers Req &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="number" value={req} onChange={handleReq}  className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Day &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="string" value={day} onChange={handleDay}  className='input-field'/>
        </label>
      </div>
      <div>
        <Dropzone onDrop={(acceptedFiles) => handleExcelUpload(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section >
              <div {...getRootProps({ className: 'dropzone' })} >
                <input {...getInputProps()} />
                <button className='btn'>Drag 'n' drop an Excel</button>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div>
        <button onClick={() => exportToExcel(res, 'Exam_Schedule')} className='btn'>
          Export to Excel
        </button>
      </div>
      <div>
        <h3>List of Teachers:</h3>
        <ul>
          {res?.map((row, index) => (
            <li key={index}>Name : {row.name} , Phone No. : {row.phone}</li>
            ))}
        </ul>
      </div>
    </div>
  );

};

export default App;