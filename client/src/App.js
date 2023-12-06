import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import './App.css';

function App() {
  const [starttime, setStarttime] = useState('8');
  const [duration, setDuration] = useState('1');
  const [day, setDay] = useState('MON');
  const [semester, setSemester] = useState('');
  const [req, setReq] = useState(1);
  const [res, setRes] = useState([]);
  
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
              resData.push({"name" : excelData[i].name, "phone" : excelData[i].phone, "FreeTime" : count, "day" : day});
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
              resData.push({"name" : excelData[i].name, "phone" : excelData[i].phone, "FreeTime" : count, "day" : day});
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
              resData.push({"name" : excelData[i].name, "phone" : excelData[i].phone, "FreeTime" : count, "day" : day});
            }
            }
          }
        }
      const sortedData = resData.slice().sort((a, b) => b.FreeTime - a.FreeTime );
      const slicedArray = sortedData.slice(0, req);
      const reqData = slicedArray.map(({FreeTime, ...restData}) => restData);
      setRes(reqData);
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
    <div className='navbar'>
      <h1>KIIT - EXAM DUTY SCHEDULAR</h1>      
    </div>
    <div className="App">
      <div>
        <label>
          Start-Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </label>
        <select className='select-container' onChange={e => setStarttime(e.target.value)}>
          <option value={'8'}>8:00 AM</option>
          <option value={'9'}>9:00 AM</option>
          <option value={'10'}>10:00 AM</option>
          <option value={'11'}>11:00 AM</option>
          <option value={'12'}>12:00 AM</option>
          <option value={'13'}>1:00 PM</option>
          <option value={'14'}>2:00 PM</option>
          <option value={'15'}>3:00 PM</option>
          <option value={'16'}>4:00 PM</option>
          <option value={'17'}>5:00 PM</option>
        </select>
      </div>
      <div>
        <label>
          Exam-Duration &nbsp;&nbsp;
        </label>
        <select className='select-container' onChange={e => setDuration(e.target.value)}>
            <option value={'1'}>1 Hour</option>
            <option value={'2'}>2 Hour</option>
            <option value={'3'}>3 Hour</option>
          </select>
      </div>
      <div>
        <label>
          Semester/Year &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="string" value={semester} onChange={e => setSemester(e.target.value)} className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Teachers Req &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="number" value={req} onChange={e => setReq(e.target.value)}  className='input-field'/>
        </label>
      </div>
      <div>
        <label>
          Day &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </label>          
          <select className='select-container' onChange={e => setDay(e.target.value)}>
            <option value={"MON"}>Monday</option>
            <option value={"TUE"}>Tuesday</option>
            <option value={"WED"}>Wednesday</option>
            <option value={"THU"}>Thursday</option>
            <option value={"FRI"}>Friday</option>
          </select>
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
            <tr key={index}>
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