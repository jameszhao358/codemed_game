function PatientImage({image}) {
    return (
      <div className="patient-image">
      <img src={require(`${image}`)} alt="Patient" />
    </div>
    );
  }
  
  export default PatientImage;