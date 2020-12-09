document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // When User sends an email
  //document.querySelector('#compose-form').addEventListener('submit', send_email2);
  document.querySelector('#compose-form').onsubmit = send_email;

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      //console.log(emails);

      //emails.forEach(function(item) {
      emails.forEach(item => {
        const email_entry = document.createElement('div');

        // Email entry contents
          // Sender
          const sender = document.createElement('div');
          sender.innerHTML = item.sender;

          // Email content
          const email_content = document.createElement('div');
          email_content.innerHTML = item.body;

          // Email timestamp
          const timestamp = document.createElement('div');
          timestamp.innerHTML = item.timestamp;

        // Finalized Email Entry
        //email_entry = sender + email_content + timestamp;
        email_entry.innerHTML = item.sender + "" + item.body + "" + item.timestamp;

        // Email entry formatting
        email_entry.style.border = "medium groove #2C3E50";
        email_entry.style.borderRadius = "5px";
          // If email has been read, its background is white, else it's grey
          if (item.read) {
            email_entry.style.backgroundColor = "#FDFEFE";
          } else {
            email_entry.style.backgroundColor = "#99A3A4";
          }

        document.querySelector('#emails-view').append(email_entry);
      });
      
  });

  return false;
}

function send_email() {
  // 
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);

      if (result.error) {
        
      } else {
        load_mailbox('sent');
      }
  });

  return false;
}

function send_email2() {
  // 
  console.log("success haha")

  return false;
}