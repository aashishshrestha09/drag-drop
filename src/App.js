import React, { useState, useCallback, useEffect } from 'react'
import MaterialTable from 'material-table'
import XLSX from 'xlsx'
import { convertToJson } from './utils'
import {useDropzone} from "react-dropzone";
import "./styles.css";

const EXTENSIONS = ['xlsx', 'xls', 'csv']

function App() {
  const [columnData, setColumnData] = useState()
  const [data, setData] = useState()
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log("hello")
    files.forEach((file) => {
      handleData(file)
    })
  }, [files])

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const getExention = (file) => {
    // console.log(file.type)
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension)
  }

  const handleData = (file) => {
 
    console.log(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      //parse data
      const binaryString = event.target.result
      const workBook = XLSX.read(binaryString, { type: "binary" })

      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]

      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })

      const headers = fileData[0]
      const heads = headers.map(head => ({ title: head, field: head }))
      setColumnData(heads)

      //removing header
      fileData.splice(0, 1)

      setData(convertToJson(headers, fileData))
    }

    if (file) {
      (getExention(file) ? reader.readAsBinaryString(file) : alert("Invalid file input, Please select Excel, CSV file!"))
    } else {
      setData([])
      setColumnData([])
    }
  }

  return (
    <div className="App">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <MaterialTable 
        title="Data Records" 
        data={data} 
        columns={columnData} 
        options={{ 
          headerStyle: {backgroundColor: '#01579b', color: '#FFF', fontWeight: 'bold'},
          rowStyle: {
            backgroundColor: '#EEE',
          },
          filtering: true
        }} 
      />
    </div>
  )
}

export default App;