
// confirm deletion 
document.querySelector('a.confirmDeletion').addEventListener('click', function(e){
   
    if(!confirm('تأكيد الحذف؟')){
        e.preventDefault()

    }
       
})

