<template>
  <div class="datenschutz-container">
    <div class="datenschutz-content">
      <h1>Privacy Policy</h1>
      <p>
        We take the protection of your personal data very seriously. The collection and processing of your personal data is carried out in compliance with applicable data protection regulations, in particular the General Data Protection Regulation (GDPR).
      </p>
      <h2>1. Information about data collection</h2>
      <p>
        In this privacy policy, we inform you about the collection of personal data when using our website. Personal data is all data that can be related to you personally, e.g., name, address, email addresses, user behavior.
      </p>
      <h2>2. Your rights</h2>
      <p>
        You have the following rights regarding your personal data stored with us:
        <ul>
          <li>Right to information</li>
          <li>Right to correction or deletion</li>
          <li>Right to restriction of processing</li>
          <li>Right to object to processing</li>
          <li>Right to data portability</li>
        </ul>
      </p>
      <h2>3. Data collection on our website</h2>
      <p>
        Data collection on this website is carried out by the website operator. You can find their contact details in the legal notice of this website.
      </p>
      <h2>4. Cookies</h2>
      <p>
        Our website partially uses so-called cookies. Cookies do not cause any damage to your computer and do not contain viruses. Cookies serve to make our offer more user-friendly, effective and secure.
      </p>
      <h2>5. Server log files</h2>
      <p>
        The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
        <ul>
          <li>Browser type and browser version</li>
          <li>Operating system used</li>
          <li>Referrer URL</li>
          <li>Hostname of the accessing computer</li>
          <li>Time of server request</li>
          <li>IP address</li>
        </ul>
        A combination of this data with other data sources is not carried out.
      </p>
      <h2>6. Contact form</h2>
      <p>
        If you send us inquiries via the contact form, your details from the inquiry form, including the contact details you provided there, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not pass on this data without your consent.
      </p>
      <h2>7. Changes to these privacy policies</h2>
      <p>
        We reserve the right to change these privacy policies at any time with effect for the future. A current version is always available on the website. Please visit the website regularly and inform yourself about the current privacy policies.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Datenschutz",
};
</script>

<style scoped>
.datenschutz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 70px; /* Abstand zur Navigationsleiste */
  padding-bottom: 50px; /* Abstand zum Footer */
  min-height: calc(100vh - 120px); /* Anpassung an die Höhe von Navbar und Footer */
}

.datenschutz-content {
  max-width: 800px;
  text-align: left;
  padding: 20px;
  background-color: #F8F8F8;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  color: #333;
  margin-top: 20px;
}

p {
  color: #555;
  font-size: 16px;
  line-height: 1.6;
}

ul {
  list-style: disc;
  margin-left: 20px;
}
</style>