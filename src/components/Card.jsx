const Card = ({ title, content, isNew, onAction }) => {
  return (
    <div className="neomorphic-card slide-up">
      <div className="card-header">
        <h2 className="gradient-text">{title}</h2>
        {isNew && <div className="card-badge">Nouveau</div>}
      </div>
      
      <div className="card-content">
        <p>{content}</p>
        <div className="card-actions">
          <Button onClick={onAction}>Action</Button>
          <span className="card-info">Plus d'infos</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 