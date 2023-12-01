import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import './App.css';

function App() {
  const [starttime, setStarttime] = useState('');
  const [duration, setDuration] = useState('');
  const [day, setDay] = useState('');
  const [semester, setSemester] = useState('');
  const [req, setReq] = useState(1);
  const [res, setRes] = useState([]);

  const handleStarttimeChange = (e) => {
    setStarttime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
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

      const semarr = semester.split(',');

      
      for(let j = 0; j<semarr.length; j++){
        for(let i=0; i<excelData.length; i++){
          for(const property in excelData[i]){
            if(property  != "name" && property != "phone" && excelData[i][property] != "X"){
              const num = Number((excelData[i][property]).split(',')[3]?.charAt(0));
              if(num == Number(semarr[j])){
                excelData[i][property] = "X";
              }
            }
          }
        }
      }
      const resData = [];

      const countConsecutiveX = (excelData) => {
        for (let i = 0; i < excelData.length; i++) {
          if(excelData[i].day == day){
            if(duration == 1){
              if(excelData[i][starttime] == "X"){
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
            else if(duration == 2){
              if(excelData[i][starttime] == "X" && excelData[i][(Number(starttime)+1).toString()] == "X"){
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
              if(excelData[i][starttime] == "X" && excelData[i][(Number(starttime)+1).toString()] == "X" && excelData[i][(Number(starttime)+2).toString()] == "X"){
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
        const reqData = slicedArray.map(({FreeTime, ...restData}) => restData);
        setRes(reqData);
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
    <>
    <div className="navbar">
      <div className="navbar-left">
          <span>KIIT - INVIGILATION DUTY SCHEDULAR</span>
      </div>
    </div>
    <div className="App">
      <div>
        <label>
          Start-Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="number" value={starttime} onChange={handleStarttimeChange} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Exam-Duration &nbsp;&nbsp;
          <input type="number" value={duration} onChange={handleDurationChange} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Semester &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="string" value={semester} onChange={handleSemesterChange} className='input-field'/>
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
        <h3>Teachers Available for Invigilation Duty:</h3>
        <table>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Phone No.</th>
          </tr>
          {res?.map((row, index) => (
            <tr>
              <td>{index+1}</td>
              <td>{row.name}</td>
              <td>{row.phone}</td>
            </tr>
            ))}
        </table>
      </div>
    </div>
    </>
  );

};

export default App;