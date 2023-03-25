import React from 'react'
import './applicantsTable.css'

//this table will display the applicants data to employers
const ApplicantsTable = ({ columns, data, handleAction, handleProfile }) => {
    return (
        <div>
            <div className="table-header">
                {columns.map((column, index) => {
                    return <div key={index} style={column.style}>{column.Header}</div>;
                })}
            </div>
            <div>
                {data.map((row) => {
                    return (
                        <div key={row.applicationId} className="table-row">
                            {columns.map((column, index) => {
                                if (column.type === "doc") {
                                    return (
                                        <div key={index} style={column.style}>
                                            <button
                                                className="profile-btn"
                                                onClick={() => {handleProfile(row)}}
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                className="resume-btn"
                                                onClick={() => {
                                                    window.open(row[column.datakey]);
                                                }}
                                            >
                                                View Resume
                                            </button>
                                        </div>
                                    );
                                }
                                else if (column.type === "action") {
                                    return (
                                        <div key={index} style={column.style}>
                                            <button
                                                disabled={row.status === "accepted" ? true : false}
                                                style={{
                                                    opacity: row.status === "accepted" ? 0.5 : 1,
                                                    display: row.status === 'declined' ? 'none' : 'block',
                                                    cursor : row.status === 'applied' ? 'pointer' : 'none'
                                                }}
                                                className="accepted"
                                                onClick={() => { handleAction("accept", row) }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="rejected"
                                                onClick={() => { handleAction("reject", row) }}
                                                disabled={row.status === "declined" ? true : false}
                                                style={{
                                                    opacity: row.status === "declined" ? 0.5 : 1,
                                                    display: row.status === 'accepted' ? 'none' : 'block',
                                                    cursor : row.status === 'applied' ? 'pointer' : 'none'
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    );
                                }
                                return <div key={index} style={column.style}>{row[column.datakey]}</div>;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ApplicantsTable