import { _data } from './data';
import { v1 as uuidv1 } from 'uuid';

const initialState = {
    popUp: false,
    popUp_ID: '',
    popTeam: false,
    popTeam_id: '',
    edit_details: {
        email: '',
        contact: '',
        name: '',
        designation: ''
    },
    _data,
    teams: {},
    search:'',
    searchedEmp: null,
    edit_team_name: ''
};


  


export default function Reducer(state = initialState, action){
    let tempData = state._data;
    let tempTeam = state.teams
    switch(action.type){
        //make leader for a team for a particular parent id
        case 'MAKE_LEADER':
            tempTeam[action.parentID].leader = action.id;
            return {
                ...state,
                teams: {
                    ...tempTeam
                }
            };
        case 'ADD_TEAM':
            let newTeamId = uuidv1()
            //creating new team under head of department
            let newTeam = {
                name: 'New Team',
                parentId: action.id,
                leader: null,
                members: []
            }
            //adding new team to tempTeam for corresponding id
            tempTeam[newTeamId] = newTeam;
            //making changes in state
            return {
                ...state,
                teams: {
                    ...tempTeam
                }
            };
        case 'ADD_LEAD':
            let empId = uuidv1();
            //creating new team lead
            let newLead = {
                "designation": "Designation",
                "name": "New User",
                "contact": "contact",
                "email": "email",
                "children": []
            };
            //adding lead to _data
            tempData[empId] = newLead;
            //adding lead to teams
            tempTeam[action.teamId].members.push(empId)
            return {
                ...state,
                teams: {
                    ...tempTeam
                },
                _data: {
                    ...tempData
                }
            }
        case 'ADD_ITEM':
            let newItemId = uuidv1();
            //creating new team member
            tempData[action.id].children.push(newItemId);
            let newMember = {
                "designation": "Designation",
                "name": "New User",
                "contact": "contact",
                "email": "email",
                "children": []
            };
            //adding new team member to _data
            tempData[newItemId] = newMember;
            return {
                ...state,
                _data: {
                    ...tempData
                }
            }
        //to display employee information
        case 'SET_POPUP':
            return {
                ...state,
                popUp: true,
                popUp_ID: action.id,
                popTeam: false,
                //editable information of the employee
                edit_details: {
                    email: state._data[action.id].email,
                    contact: state._data[action.id].contact,
                    name: state._data[action.id].name,
                    designation: state._data[action.id].designation
                }
            };
        //to handle change of email 
        case 'CHANGE_EMAIL':
            return {
                ...state,
                edit_details: {
                    email: action.text
                }
            }
        //to handle change of name 
        case 'CHANGE_NAME':
            return {
                ...state,
                edit_details: {
                    name: action.text
                }
            }
        //to handle change of designation
        case 'CHANGE_DESIGNATION':
            return {
                ...state,
                edit_details: {
                    designation: action.text
                }
            }
        //to handle change of contact
        case 'CHANGE_CONTACT':
            return {
                ...state,
                edit_details: {
                    contact: action.text
                }
            }
        //to handle change of team name
        case 'CHANGE_TEAM_NAME':
            return {
                ...state,
                edit_team_name: action.text
            }
        //saving changes made to employee information
        case 'SAVE_CHANGES':
            let changes = state.edit_details;
            //updating changes in tempData
            tempData[action.id] = {
                ...tempData[action.id],
                ...changes
            };
            //updating the state
            return{
                ...state,
                popUp: false,
                _data: {
                    ...tempData
                }
            }
        //removing head of departments
        case 'DELETE_ITEM':
            tempData[action.id].children = tempData[action.id].children.filter(item => { return item !== action.id1 });
            delete tempData[action.id1];
            return{
                ...state,
                _data: {
                   ...tempData 
                }
            }
        //deleting team
        case 'DELETE_TEAM':
            for(let user of tempTeam[action.id].members) {
                delete tempData[user];
            }
            delete tempTeam[action.id];
            return{
                ...state,
                _data: {
                    ...tempData
                },
                teams: {
                    ...tempTeam
                }
            }
        //removing an employee
        case 'DELETE_TEAM_MEMBER':
            tempTeam[action.id].members = tempTeam[action.id].members.filter(item=>{ return item!==action.id1});
            delete tempData[action.id1];
            return {
                ...state,
                _data: {
                    ...tempData
                },
                teams: {
                    ...tempTeam
                }
            }
        //searching for an employee
        case 'SEARCH_EMPLOYEE':
            //if length of searched text is 0, nothing changes
            if(action.text.length === 0){
                return{
                    ...state,
                    search: '',
                    searchedEmp: null
                } 
            }
            //else searchedEmp gets all the employees having the searched text
            else{
                let searchedEmp = Object.keys(state._data).filter((key) => {
                     return state._data[key].name
                     .toLowerCase()
                     .includes(action.text.toLowerCase()) 
                     || state._data[key].contact.includes(action.text) 
                     || state._data[key].email
                     .toLowerCase()
                     .includes(action.text.toLowerCase()) 
                });
                //if length of array is greater than 0, then state is updated.
                if(searchedEmp.length>0){
                    return{
                        ...state,
                        search: action.text,
                        searchedEmp: searchedEmp  
                    }
                }
                else{
                    return{
                    ...state,
                    search: action.text,
                    searchedEmp: null
                }
                }
            }
        //display team details
        case 'SHOW_TEAM':
            return {
                ...state,
                popTeam: true,
                popTeam_id: action.id,
                edit_team_name: state.teams[action.id].name
            };
        //saving new team name
        case 'SAVE_TEAM_NAME':
            tempTeam[state.popTeam_id].name = state.edit_team_name;
            return {
                ...state,
                popTeam: false,
                teams: {
                    ...tempTeam
                }
            }    
        //saving data in local storage
        case 'SAVE_DATA':
            localStorage.setItem("data", JSON.stringify(state._data));
            localStorage.setItem("teams", JSON.stringify(state.teams));
            return state;
        //retriving data from local storage and updating state according to that
        case 'RETRIEVE_DATA':
            return{
                ...state,
                _data: {
                    ...action.d._data
                },
                teams: {
                    ...action.d.teams
                }
            }
        default:
            return state;
    }
} 