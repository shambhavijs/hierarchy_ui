import React, { useEffect } from "react";
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from "./Card";

const App = () => {

  //style to display employee information
  let styles = {
    inputStyle: {
      display: 'flex'
    }, 
    inputStyle1: {
      display: 'none'
    }
  };

  //fetching data from state using hooks
  const _data = useSelector((state) => state._data);
  const popUp = useSelector((state) => state.popUp);
  const popUp_ID = useSelector((state) => state.popUp_ID);
  const search = useSelector((state) => state.search);
  const teams = useSelector((state) => state.teams);
  const edit_details = useSelector((state) => state.edit_details);
  const popTeam = useSelector((state) => state.popTeam);
  const popTeam_id = useSelector((state) => state.popTeam_id);
  const edit_team_name = useSelector((state) => state.edit_team_name);

  //returning referenece to dispatch function from Redux store
  const dispatch = useDispatch();

  //using useEffect when component mounts to retrieve data from local Storage
  useEffect(() => {
    const data_string = localStorage.getItem("data");
    const teams_string = localStorage.getItem("teams");
    let data = {
      _data: JSON.parse(data_string),
      teams: JSON.parse(teams_string)
    };
    dispatch({ type: 'RETRIEVE_DATA', d: data})
  },[]);

  

  return (
    <div className="grid">
      <section className="search-bar">
        <input className="search" placeholder="Search using Email, Contact or Name" type="text" value={ search ? search : "" } onChange={(e) => dispatch({ type: 'SEARCH_EMPLOYEE', text: e.target.value })}></input>
      </section>
      <section className="main-section">
        {/*calling Card component for each employee*/}
        <Card data={_data.root} id={"root"} state={_data} teams={teams} level={1}/>
        {/*section to display employee details*/}
        {popTeam?
        <section className="detail-section">
            <div className="employee-detail">
              <span className="team-name-span">
                <input value={edit_team_name} className="team-name" onChange={(e) => dispatch({ type: 'CHANGE_TEAM_NAME', text: e.target.value })} />
                <button className="back" onClick={() => dispatch({ type: 'SAVE_TEAM_NAME' })}><img className="back-icon" src="../cancel.png"/></button>
              </span>
              <ul className="team-member-list">
                {teams[popTeam_id].members.map((item) =>
                <li className="team-member-name" key={"teamMember"+item}>
                    {_data[item].name}
                </li>
                )}
              </ul>
            </div>
        </section>:
        <section className="detail-section" style={popUp ? styles.inputStyle : styles.inputStyle1}>
                <div className="employee-detail">
                  <span className="name-span">
                    {/* dispatching actions to edit employee details */}
                    <input className="name" type="text" value={edit_details.name} onChange={(e) => dispatch({ type: 'CHANGE_NAME', text: e.target.value, id: popUp_ID})}></input>
                    <button className="back" onClick={() => dispatch({ type: 'SAVE_CHANGES', id: popUp_ID })}><img className="back-icon" src="../cancel.png"/></button>
                  </span>
                  <input className="name" type="text" value={edit_details.designation} onChange={(e) => dispatch({ type: 'CHANGE_DESIGNATION', text: e.target.value, id: popUp_ID})}></input>
                  <input type="email" value={edit_details.email} className="email" onChange={(e) => dispatch({ type: 'CHANGE_EMAIL', text: e.target.value, id: popUp_ID})}></input>
                  <input defaultValue={popUp_ID} className="id"></input>
                  <input value={edit_details.contact} className="contact" onChange={(e) => dispatch({ type: 'CHANGE_CONTACT', text: e.target.value, id: popUp_ID})}></input>
                </div>
        </section>
        }
      </section>
      {/* dispatching action to save data in local storage on button click */}
      <button className="save" onClick={() => dispatch({ type: 'SAVE_DATA' })}>Save</button>
    </div> 
  );
};

export default App;

 