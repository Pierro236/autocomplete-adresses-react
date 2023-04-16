//import react from "react";
import styles from "../styles/Form.css";
import { useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";


const Form = () => {
  //On initilise l'api en mettant la clé
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.MAPS_API_KEY,
    libraries: ["places"],
  });
  if (!isLoaded) console.log("not loaded");
  // ça sert à gerer l'etat des composants de l'adresse
  const [form, setForm] = useState({
    roadnumber: "",
    road: "",
    postalcode: "",
    city: "",
  });
  // Pour sauvegarder l'autocomplete quand quelqun le selectionne
  const [autocomplete, setAutoComplete] = useState(null);
  // Gérer les changements des données du form
  const handleChange = (event) => {
    setForm(() => ({
      ...form,
      [event.target.name]: event.target.value,
    }));
  };
  // Pour compléter les composants de l'adresse
  const setCompleteAdress = (place) => {
    // un console log de l'objet autocomplete.getPlace() ma permis de voir la structure des données et d'extraire celle dont j'avais besoin
    const roadnumber = place.address_components[0].long_name; // Numéro de rue
    const road = place.address_components[1].long_name; // Nom de la rue
    const postalcode = place.address_components[2].long_name; // code postal
    const city = place.address_components[6].long_name; // ville
    const updatedForm = {
      // cette variable sert a update le form avec les valeurs connues
      ...form,
      roadnumber,
      road,
      postalcode,
      city,
    };
    setForm(updatedForm); // change l'état du form
  };

  const handleSub = () => {
    // vérification de la tet des données
    console.log(form);
  };

  return isLoaded ? (
    <div className="form">
      <div className="title">Welcome Dog</div>
      <div className="subtitle">Let's find your address</div>
      <div className="input-container ic1">
        <Autocomplete // balise autocomplete (il suffit de mettre l'input dedant et la magie opère)
          className="input"
          options={{
            componentRestrictions: {
              country: ["fr"], // rechercher uniquement en france
            },
          }}
          onLoad={(autocomplete) => {
            // cette fonction permet de specifier ce qu'on veut recevoir comme résultat
            autocomplete.setFields(["address_components", "formatted_address"]); // les données que je veux
            setAutoComplete(autocomplete); // stocker l'autocomplete
          }}
          onPlaceChanged={() => {
            if (autocomplete) {
              const place = autocomplete.getPlace(); // recuperer les éléments specifiées plus haut (address_components, formatted_adress)
              console.log(place); // Afficher pour verifier
              setCompleteAdress(place); //mettre a jour
            }
          }}
        >
          <input
            name="roadnumber"
            className="input"
            type="text"
            placeholder="Numéro"
            value={form.roadnumber} // recupère la valeur roadnumber(son état est toutjours mis à jour )
            onChange={handleChange} // en cas de changement l'état est mis à jour
          />
        </Autocomplete>
      </div>
      <div className="input-container ic2">
        <input
          name="road"
          className="input"
          type="text"
          placeholder="Rue"
          value={form.road}
          onChange={handleChange}
        />
      </div>
      <div className="input-container ic2">
        <input
          name="postalcode"
          className="input"
          type="text"
          placeholder="Code Postal"
          value={form.postalcode}
          onChange={handleChange}
        />
      </div>
      <div className="input-container ic2">
        <input
          name="city"
          className="input"
          type="text"
          placeholder="Ville"
          value={form.city}
          onChange={handleChange}
        />
      </div>
      <button type="text" className="submit" onClick={handleSub}>
        submit
      </button>
    </div>
  ) : (
    console.log("error")
  );
};
export default Form;
