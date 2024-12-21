<template>
  <div class="datenschutz-container">
    <div class="datenschutz-content">
      <h1>Datenschutz</h1>
      <p>
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO).
      </p>
      <h2>1. Information über die Datenerhebung</h2>
      <p>
        In dieser Datenschutzerklärung informieren wir Sie über die Erhebung personenbezogener Daten bei Nutzung unserer Website. Personenbezogene Daten sind alle Daten, die auf Sie persönlich beziehbar sind, z. B. Name, Adresse, E-Mail-Adressen, Nutzerverhalten.
      </p>
      <h2>2. Ihre Rechte</h2>
      <p>
        Sie haben folgende Rechte hinsichtlich Ihrer bei uns gespeicherten personenbezogenen Daten:
        <ul>
          <li>Auskunftsrecht</li>
          <li>Recht auf Berichtigung oder Löschung</li>
          <li>Recht auf Einschränkung der Verarbeitung</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung</li>
          <li>Recht auf Datenübertragbarkeit</li>
        </ul>
      </p>
      <h2>3. Datenerfassung auf unserer Website</h2>
      <p>
        Die Datenerfassung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
      </p>
      <h2>4. Cookies</h2>
      <p>
        Unsere Internetseite verwendet teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </p>
      <h2>5. Server-Log-Dateien</h2>
      <p>
        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>
        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
      </p>
      <h2>6. Kontaktformular</h2>
      <p>
        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
      </p>
      <h2>7. Änderungen dieser Datenschutzrichtlinien</h2>
      <p>
        Wir behalten uns das Recht vor, diese Datenschutzrichtlinien jederzeit mit Wirkung für die Zukunft zu ändern. Eine aktuelle Version ist stets auf der Website verfügbar. Bitte besuchen Sie die Website regelmäßig und informieren Sie sich über die geltenden Datenschutzrichtlinien.
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