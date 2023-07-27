import './App.css';
import Axios from "axios" // package to call API
import { useState, useEffect } from 'react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function App() {

  const api = "http://localhost:3001"

  const [deptFinancials, setdeptFinancials] = useState([]);

  const [Project, setProject] = useState("");
  const [Proposal, setProposal] = useState("");
  const [Quotations, setQuotations] = useState("");
  const [SignOff, setSignOff] = useState("");
  const [Quoted, setQouted] = useState("");
  const [Invoiced, setInvoiced] = useState("");
  const [TimeProposal, setTimeProposal] = useState([null, null]);
  const [TimeActual, setTimeActual] = useState([null, null]);
  const [Status, setStatus] = useState("");

  const [editProposal, setEditProposal] = useState(null);
  const [proposals, setProposals] = useState([]);


  useEffect(() => {
    getDeptFinancials();
  }, []);

  const getDeptFinancials = () => {
    Axios.get(`${api}/deptFinancial`)
      .then((res) => {
        const sortedData = res.data.sort((a, b) => a.Project.localeCompare(b.Project));
        setdeptFinancials(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const createProposal = () => {
    if (Project && Proposal && Quotations && SignOff && Quoted && Invoiced && TimeProposal && TimeProposal[1] && TimeActual[1] && TimeActual && Status) {
      Axios.post(`${api}/creatProposal`, {
        Project: Project,
        Proposal: Proposal,
        Quotations: Quotations,
        SignOff: SignOff,
        Quoted: Quoted,
        Invoiced: Invoiced,
        TimeProposal: TimeProposal,
        TimeActual: TimeActual,
        Status: Status,
      })
        .then(res => {
          console.log(res.data);
          getDeptFinancials(); // Refresh the table data after creating a new row
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const deleteProposal = (id) => {
    console.log(`Deleting proposal with ID ${id}`);
    Axios.delete(`${api}/deleteProposal/${id}`)
      .then((res) => {
        console.log(res.data);
        getDeptFinancials(); // Refresh the table data after deleting a row
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function updateProposal(id) {
    try {
      const res = await fetch(`${api}/updateProposal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editProposal)
      });

      const data = await res.json();

      // Update proposals state with new data
      setProposals(proposals.map(val => {
        if (val._id === id) {
          return data;
        } else {
          return val;
        }
      }));

      // Reset editProposal state  
      setEditProposal(null);
      getDeptFinancials();

    } catch (err) {
      console.error(err);
    }
  }

  const tableHeaders = (
    <thead>
      <tr>
        <th>Projects</th>
        <th>Proposal</th>
        <th>Quotations</th>
        <th>SignOff</th>
        <th>Quoted</th>
        <th>Invoiced</th>
        <th>TimeProposal</th>
        <th>TimeActual</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );

  return (
    <>
        <img src='https://smart.sa/wp-content/themes/twentynineteen-child/assets/images/logo.png'alt='logo'/>
        <h1 className="text-2xl">Proposal Dashboard</h1>
      <table>
        {tableHeaders}
        <tbody>
          <tr>
            <td><input type="text" placeholder="Project Name" onChange={e => setProject(e.target.value)} /></td>
            <td>
              <select value={Proposal} onChange={(e) => setProposal(e.target.value)}>
                <option value="-">-</option>
                <option value="Not Sent">Not Sent</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
                <option value="On Hold">On Hold</option>
              </select>
            </td>
            <td>
              <select value={Quotations} onChange={(e) => setQuotations(e.target.value)}>
                <option value="-">-</option>
                <option value="Not Sent">Not Sent</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
                <option value="On Hold">On Hold</option>
              </select>
            </td>
            <td>
              <select value={SignOff} onChange={(e) => setSignOff(e.target.value)}>
                <option value="-">-</option>
                <option value="Not Sent">Not Sent</option>
                <option value="Sent">Sent</option>
                <option value="Signed">Signed</option>
              </select>
            </td>
            <td><input type="text" placeholder="Quoted" onChange={e => setQouted(e.target.value)} defaultValue={"-"} /></td>
            <td>
              <select value={Invoiced} onChange={(e) => setInvoiced(e.target.value)}>
                <option value="-">-</option>
                <option value="Invoiced to Finance Dep. ">Invoiced to Finance Dep. </option>
                <option value="Invoiced">Invoiced</option>
                <option value="Invoiced (Annual)">Invoiced (Annual)</option>
                <option value="Paid">Paid</option>
                <option value="On Hold">On Hold</option>
                <option value="Declined ">Declined</option>
                <option value="1st 25% invoiced">1st 25% invoiced</option>
                <option value="1st 25% Paid">1st 25% Paid</option>
                <option value="1st 50% invoiced">1st 50% invoiced</option>
                <option value="1st 50% Paid">1st 50% Paid</option>
                <option value="2nd 50% invoiced">2nd 50% invoiced</option>
                <option value="2nd 50% Paid">2nd 50% Paid</option>
                <option value="Invoice Canceled">Invoice Canceled</option>
              </select>
            </td>
            <td>
              <DatePicker
                selected={TimeProposal[0]}
                onChange={dates => setTimeProposal(dates)}
                selectsRange
                startDate={TimeProposal[0]}
                endDate={TimeProposal[1]}
                placeholderText="Select date range"
              />
            </td>

            <td>
              <DatePicker
                selected={TimeActual[0]}
                onChange={dates => setTimeActual(dates)}
                selectsRange
                startDate={TimeActual[0]}
                endDate={TimeActual[1]}
                placeholderText="Select date range"
              />
            </td>
            <td>
              <select value={Status} onChange={(e) => setStatus(e.target.value)}>
                <option value="-">-</option>
                <option value="On Track">On Track</option>
                <option value="Collection">Collection</option>
                <option value="Need Invoicing">Need Invoicing</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </td>
            <td>
              <button onClick={createProposal}>Add</button>
            </td>
          </tr>
          {deptFinancials.map((val, key) => {
            const timeProposalStart = val.TimeProposal && val.TimeProposal[0] ? new Date(val.TimeProposal[0]).toLocaleDateString() : '';
            const timeProposalEnd = val.TimeProposal && val.TimeProposal[1] ? new Date(val.TimeProposal[1]).toLocaleDateString() : '';
            const timeActualStart = val.TimeActual && val.TimeActual[0] ? new Date(val.TimeActual[0]).toLocaleDateString() : '';
            const timeActualEnd = val.TimeActual && val.TimeActual[1] ? new Date(val.TimeActual[1]).toLocaleDateString() : '';

            return (
              <tr key={key}>
                <td>{val.Project}</td>
                <td>{val.Proposal}</td>
                <td>{val.Quotations}</td>
                <td>{val.SignOff}</td>
                <td>{val.Quoted}</td>
                <td>{val.Invoiced}</td>
                <td>{timeProposalStart} - {timeProposalEnd}</td>
                <td>{timeActualStart} - {timeActualEnd}</td>
                <td>{val.Status}</td>
                <td>
                  <button onClick={() => setEditProposal(val)}>Edit</button>
                  <button onClick={() => deleteProposal(val._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editProposal &&
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Proposal</h2>
            <label>Project:</label>
            <input type="text" value={editProposal.Project} onChange={e => setEditProposal({ ...editProposal, Project: e.target.value })} />
            <label>Proposal:</label>
            <select value={editProposal.Proposal} onChange={e => setEditProposal({ ...editProposal, Proposal: e.target.value })}>
              <option value="-">-</option>
              <option value="Not Sent">Not Sent</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
              <option value="On Hold">On Hold</option>
            </select>
            <label>Quotations:</label>
            <select value={editProposal.Quotations} onChange={e => setEditProposal({ ...editProposal, Quotations: e.target.value })}>
              <option value="-">-</option>
              <option value="Not Sent">Not Sent</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
              <option value="On Hold">On Hold</option>
            </select>
            <label>SignOff:</label>
            <select value={editProposal.SignOff} onChange={e => setEditProposal({ ...editProposal, SignOff: e.target.value })}>
              <option value="-">-</option>
              <option value="Not Sent">Not Sent</option>
              <option value="Sent">Sent</option>
              <option value="Signed">Signed</option>
            </select>
            <label>Quoted:</label>
            <input type="text" value={editProposal.Quoted} onChange={e => setEditProposal({ ...editProposal, Quoted: e.target.value })} />
            <label>Invoiced:</label>
            <select value={editProposal.Invoiced} onChange={e => setEditProposal({ ...editProposal, Invoiced: e.target.value })}>
              <option value="Invoiced to Finance Dep. ">Invoiced to Finance Dep. </option>
              <option value="Invoiced">Invoiced</option>
              <option value="Invoiced (Annual)">Invoiced (Annual)</option>
              <option value="Paid">Paid</option>
              <option value="On Hold">On Hold</option>
              <option value="Declined ">Declined</option>
              <option value="1st 25% invoiced">1st 25% invoiced</option>
              <option value="1st 25% Paid">1st 25% Paid</option>
              <option value="1st 50% invoiced">1st 50% invoiced</option>
              <option value="1st 50% Paid">1st 50% Paid</option>
              <option value="2nd 50% invoiced">2nd 50% invoiced</option>
              <option value="2nd 50% Paid">2nd 50% Paid</option>
              <option value="Invoice Canceled">Invoice Canceled</option>
            </select>
            <label>TimeProposal:</label>
            <DatePicker
              selected={editProposal.TimeProposal && editProposal.TimeProposal[0] ? new Date(editProposal.TimeProposal[0]) : null}
              onChange={dates => setEditProposal({ ...editProposal, TimeProposal: [dates[0], dates[1]] })}
              selectsRange
              startDate={editProposal.TimeProposal && editProposal.TimeProposal[0] ? new Date(editProposal.TimeProposal[0]) : null}
              endDate={editProposal.TimeProposal && editProposal.TimeProposal[1] ? new Date(editProposal.TimeProposal[1]) : null}
            />
            <br />
            <label>TimeActual:</label>
            <DatePicker
              selected={editProposal.TimeActual && editProposal.TimeActual[0] ? new Date(editProposal.TimeActual[0]) : null}
              onChange={dates => setEditProposal({ ...editProposal, TimeActual: [dates[0], dates[1]] })}
              selectsRange
              startDate={editProposal.TimeActual && editProposal.TimeActual[0] ? new Date(editProposal.TimeActual[0]) : null}
              endDate={editProposal.TimeActual && editProposal.TimeActual[1] ? new Date(editProposal.TimeActual[1]) : null}
            />
            <br />
            <label>Status:</label>
            <select value={editProposal.Status} onChange={e => setEditProposal({ ...editProposal, Status: e.target.value })}>
              <option value="-">-</option>
              <option value="On Track">On Track</option>
              <option value="Collection">Collection</option>
              <option value="Need Invoicing">Need Invoicing</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button onClick={() => updateProposal(editProposal._id)}>Save</button>
            <button onClick={() => setEditProposal(null)}>Cancel</button>
          </div>
        </div>
      }
    </>
  );
}