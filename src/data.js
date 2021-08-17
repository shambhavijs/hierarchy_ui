import { v1 as uuidv1 } from 'uuid';


let level2_1 = uuidv1();
let level2_2 = uuidv1();
let level2_3 = uuidv1();

let _data = {
    "root": {
      "designation": "CEO",
      "name": "John Smith",
      "contact": "9382973912",
      "email": "john@a0001.com",
      "children": [level2_1, level2_2, level2_3]
  }
};


_data[level2_1] = {
      "designation": "Head of Design",
      "name": "Allan Savage",
      "contact": "9382976668",
      "email": "allan@a1001.com",
      "children": []
  };

_data[level2_2] ={
      "designation": "Head of Engineering",
      "name": "Tracie McKinney",
      "contact": "9002898112",
      "email": "tracie@a2001.com",
      "children": []
  };

_data[level2_3] = {
      "designation": "Head of Staff/HR",
      "name": "Shilpa NR",
      "contact": "9661273542",
      "email": "shilpa@3001.com",
      "children": []
  };

  export { _data };