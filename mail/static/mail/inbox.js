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
  document.querySelector('#email-entry-view').style.display = 'none';

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
        email_entry.innerHTML = item.sender + ", " + item.body + ", " + item.timestamp;

        // Email entry formatting
        email_entry.style.border = "medium groove #2C3E50";
        email_entry.style.borderRadius = "5px";
        email_entry.style.cursor = "pointer"
          // If email has been read, its background is white, else it's grey
          if (item.read) {
            email_entry.style.backgroundColor = "#FDFEFE";
          } else {
            email_entry.style.backgroundColor = "#99A3A4";
          }
        
        // Viewing Email functionality
        email_entry.addEventListener('click', () => view_email(item));

        document.querySelector('#emails-view').append(email_entry);
      });
      
  });

  return false;
}

function view_email(email) {
  // Hide other views (mailbox, sent, compose, archive)
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-entry-view').style.display = 'block';

  // Clear out previous loaded email
  document.querySelector('#email-entry-view').innerHTML = '';
    //document.querySelector('#email-entry-view').value = '';

  // Contents of email entry
  const email_entry = document.createElement('div');
  email_entry.innerHTML += "<div>" + "From: " + email.sender + "</div>";
  email_entry.innerHTML += "<div>" + "To: " + email.recipients.join(',') + "</div>";
  email_entry.innerHTML += "<div>" + "Subject: " + email.subject + "</div>";
  email_entry.innerHTML += "<div>" + "Timestamp: " + email.timestamp + "</div>";
  email_entry.innerHTML += "<hr>";
  email_entry.innerHTML += email.body;

  // Archive button 
  const archive_button = document.createElement('button');
  archive_button.className = "btn btn-sm btn-outline-primary";
  archive_button.innerHTML = "Archive";
  // Adding Archive functionality
  archive_button.addEventListener('click', () => archive_email(email.id));

  /*
  // Contents of email entry
  email.forEach((item) => {
    if (item) {
      email_entry += document.createElement('div') + "<div>";
    }
  }); */
  
  // Mark the email as read
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  // Adding the details of 
  document.querySelector('#email-entry-view').append(email_entry);
  document.querySelector('#email-entry-view').append(archive_button);
  
}

function archive_email(email_id) {
  // Archive the specified email as per its id

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })

  console.log("Email archived: " + email_id);
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
