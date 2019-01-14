$(document).ready(function(){
  // activate dropdown
  $(".dropdown-trigger").dropdown();
  $('.sidenav').sidenav();
})



document.addEventListener('DOMContentLoaded',()=>{
  // create an iterator function to clear alert messages
function alertInterator(alertArr){
  let index=0;
  const alert = document.querySelector('.alert')
  return{
    next:function(){
      if(alert){
        alert.remove()
        alertArr.shift()
      }
      if(alertArr.length===0){clearInterval(timing)}
      }
    }
  }
const timing = setInterval(()=>{
  const alertNodes = document.querySelectorAll('.alert')
  const alertArr = Array.from(alertNodes)
  const alertremove = alertInterator(alertArr)
  if(alertArr.length>0){
    alertremove.next()
  }
},3000)

})

