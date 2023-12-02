

// gets teams form the api
const getTeams = async () => {
    try {
        return (await fetch("api/teams")).json();

    }catch (error){
        console.log("Error loading json");
    }

}
// puts teams into a html secion to be displayed
const showTeams = async() => {

    let teams = await getTeams();
    let teamDiv = document.getElementById("teams-list");
    console.log(teams);

    teams.forEach((team)=>{
        const section = document.createElement("section");
        teamDiv.appendChild(section);

        const h2 = document.createElement("h2");
        h2.innerHTML = team.name;
        section.appendChild(h2);

        const edit = document.createElement("a");
        edit.innerHTML = "&#9998;";
        section.append(edit);
        edit.id = "edit-link"+team.name;

        const del = document.createElement("a");
          del.innerHTML = "&#x2715;";
         section.append(del);
         del.id = "delete-link";

       const qb = document.createElement("h3");
        qb.innerHTML = team.qb;
        section.appendChild(qb);

        const rb = document.createElement("h3");
        rb.innerHTML = team.rb;
        section.appendChild(rb);

       const  wr1 = document.createElement("h3");
        wr1.innerHTML = team.wr1;
        section.appendChild(wr1);

       const wr2 = document.createElement("h3");
        wr2.innerHTML = team.wr2;
        section.appendChild(wr2);

       const wr3 = document.createElement("h3");
        wr3.innerHTML = team.wr3;
        section.appendChild(wr3);

        edit.onclick = (e)=>{
            e.preventDefault;
            document.querySelector(".dialog").classList.remove("transparent");
            document.getElementById("add-edit-title").innerHTML = "Edit Team";
            editTeam(team);
        }

        del.onclick = (e) => {
            e.preventDefault();
           delTeam(team);
        };

      // populateEditForm(team); 

    });

}
// appends a team to the json file
const addEditTeam = async (e)=>{
    e.preventDefault();
    const form = document.getElementById("team-form");
    const formData = new FormData(form);
    //console.log(...formData);
    formData.delete("img");
    let response;
   //console.log(form.qb.value);
    //add
   if (form._id.value == -1){
    //console.log(form.__id.value);
    formData.delete("_id");
    response = await fetch("/api/teams",{
        method:"POST",
        body: formData,
    });
   }else {
    //edit 
    //console.log(...formData);
    response = await fetch(`/api/teams/${form._id.value}`,{
        method:"PUT",
        body: formData,
    });
   }
//error check
   if(response.status != 200){
    console.log("error posting data");
   }
   
   response  = await response.json();

   if (form._id.value != -1){
    //displayDetails(team);
}
//console.log(...formData);
resetForm();
document.querySelector(".dialog").classList.add("transparent");
showTeams();

}
const showHideAdd =(e)=>{
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML="Add Team";
    resetForm();
}

// this works somehow??
const editTeam =(team)=>{
 populateEditForm(team);

}
const delTeam = async(team)=>{
    deleteTeam(team);
}
const populateEditForm = (team) => {
    const form = document.getElementById("team-form");
    form._id.value = team._id;
    form.name.value = team.name;
    form.qb.value = team.qb;
    form.rb.value = team.rb;
    form.wr1.value = team.wr1;
    form.wr2.value = team.wr2;
    form.wr3.value = team.wr3;
};
const deleteTeam = async(team) =>{
   //console.log(team._id);
  let response = await fetch(`/api/teams/${team._id}`,{
    method: 'DELETE',
    headers:{
        "content-type": "application/json;charset=utf-8",

    }
    
  });
if (response.status !== 200) {
    console.log("error deleting team");
    return;
}
let result = await response.json();

showTeams();
resetForm();
}
const resetForm = () => {
    const form = document.getElementById("team-form");
    form.reset();
    form._id = "-1";
    document.getElementById("teams-list").innerHTML = "";
};
window.onload = () => {
showTeams();
document.getElementById("team-form").onsubmit=addEditTeam;
document.getElementById("add").onclick = showHideAdd;
document.querySelector('.close').onclick =()=>{
    document.querySelector('.dialog').classList.add('transparent');
};
}
