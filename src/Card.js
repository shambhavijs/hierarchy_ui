import React from "react";
import { useDispatch, useSelector } from 'react-redux';


//listChildren for calling Card component for different levels of hierarchy
const listChildren = (props, Card) => {
  let level = props.level;
  if(level===1) {
    return props.data.children.map((item) => {
      return (
        <Card 
          data={props.state[item]} 
          teams={props.teams}
          id={item} 
          key={item} 
          state={props.state} 
          parentID={props.id}
          level={props.level+1}
        />
      )
    })
  }
  else if(level === 2) {
    return Object.keys(props.teams).filter(item=>props.teams[item].parentId===props.id).map((item) => {
      return (
        <Card 
          data={props.teams[item]} 
          id={item} 
          key={item} 
          state={props.state} 
          parentID={props.id}
          level={props.level+1}
        />
      )
    })
  }
  else if(level === 3) {
    return props.data.members.map((item) => {
      return (
        <Card 
          data={props.state[item]} 
          id={item} 
          key={item} 
          state={props.state} 
          parentID={props.id}
          level={props.level+1}
        />
      )
    })
  }
  else {
    return null
  }
}

//custom action for adding team/team member based on level
const switchAddAction = (level, a1, a2, levelCheck) => {
  if(level===levelCheck) {
    return a1
  } else {
    return a2
  }
};

//conponent to display Team after level 2 of hierarchy
const DisplayTeam = (props) => {
  const teams = useSelector((state) => state.teams);
  const dispatch = useDispatch();
  return (
  <li>
      <button className="card"  onClick={() => dispatch({ type: 'SHOW_TEAM', id: props.id })}>
        {props.data.name}
      </button>
      <button 
        className="add"  
        onClick={() => dispatch({ type: 'ADD_LEAD', id: props.parentID, teamId: props.id })}
      >
        <img className="add-icon" src="../plus.png"/>
      </button>
      <button className="add"  onClick={() => dispatch({ type: 'DELETE_TEAM',
        id: props.id })}><img className="add-icon" src="../delete.png"/>
      </button>
  </li>
  )
}

//component to display employee name with designation for level other than 3
const DisplayEmp = (props) =>{
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const checkIfLead = props => {
    //to create team leader
  return (
      teams[props.parentID].leader !== props.id
      ?
      <button 
        className="make-leader"  
        onClick={() => dispatch({ type: 'MAKE_LEADER', id: props.id, parentID: props.parentID })}
      >
        Make Leader
      </button>
      :
      <button 
        className="make-leader leader"  
      >
        Team Lead
      </button>
    )
  };
  //to display all team members
  return(
  <li>
      <button className="card"  onClick={() => dispatch({ type: 'SET_POPUP',
        id: props.id })}>
        {props.data.name}, {props.data.designation}
      </button>
      {props.level !== 4
        ?
        <button 
          className="add"  
          onClick={() => dispatch({ type: switchAddAction(props.level, 'ADD_TEAM', 'ADD_ITEM', 2), id: props.id })}
        >
          <img className="add-icon" src="../plus.png"/>
        </button>
        :
        checkIfLead(props)
      }
      
      <button className="add"  onClick={() => dispatch({ type: switchAddAction(props.level, 'DELETE_TEAM_MEMBER', 'DELETE_ITEM', 4),
        id: props.parentID, id1: props.id })}><img className="add-icon" src="../delete.png"/>
      </button>
  </li>
  );
}

export function Card(props){
  const searchedEmp = useSelector((state) => state.searchedEmp);
  const dispatch = useDispatch();
  return (
    <div>
      {searchedEmp?
        searchedEmp.map(key => {
          let itemKey = "search"+key;
          {/* looping over searchedEmp array to display searched employee*/}
          return (
            <section key={itemKey}>
              <button className="card" onClick={() => dispatch({ type: 'SET_POPUP',
                  id: key  })}>
                  {props.state[key].name}, {props.state[key].designation}
                </button>
            </section>
          )
        })
      :
      <section className="card-block">
      <ul className="employee-list">
        {(props.level === 3)?
        //displaying team name when level is 3
            <DisplayTeam parentId={props.parentID} data={props.data} id={props.id}/>
            :
            //displaying employee name for all other level
            <DisplayEmp id = {props.id} data={props.data} level={props.level} parentID={props.parentID} />
        }
          {listChildren(props, Card)}
        </ul>
      </section>
      }
    </div>
    );
  };


