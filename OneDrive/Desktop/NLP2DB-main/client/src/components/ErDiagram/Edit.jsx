import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrashAlt,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "./Edit.css";
const Edit = ({ erDiagram, setErDiagram, setView, updateErdiagram }) => {
  const [localDiagram, setLocalDiagram] = useState(erDiagram);
  const [isViewMode, setIsViewMode] = useState(false);

  const toggleViewMode = () => {
    setIsViewMode((prev) => !prev);
    setView((prev) => !prev);
  };

  //console.log(erDiagram);
  useEffect(() => {
    setLocalDiagram(erDiagram); // Sync with prop changes
  }, [erDiagram]);
  // Handle changes to entity fields (name, primary key)
  const handleEntityChange = (index, field, value) => {
    const updatedEntities = [...localDiagram.entities];
    const entityToUpdate = updatedEntities[index];
    const oldName = entityToUpdate.name;
    const oldPrimaryKey = entityToUpdate.primaryKey;

    // Update the entity field
    entityToUpdate[field] = value;

    // If primary key is updated, update all references
    if (field === "primaryKey") {
      entityToUpdate.attributes.forEach((attr) => {
        if (attr.name === oldPrimaryKey) {
          attr.name = value; // Update primary key attribute name
        }
      });

      updatedEntities.forEach((entity) => {
        entity.attributes.forEach((attr) => {
          if (attr.name === oldPrimaryKey) {
            attr.name = value; // Update foreign key references
          }
        });
      });
    }

    const updatedRelationships =
      field === "name"
        ? localDiagram.relationships.map((rel) => {
            const updatedRel = { ...rel };
            if (rel.from === oldName) updatedRel.from = value;
            if (rel.to === oldName) updatedRel.to = value;
            if (rel.from === oldPrimaryKey) updatedRel.from = value;
            if (rel.to === oldPrimaryKey) updatedRel.to = value;
            return updatedRel;
          })
        : localDiagram.relationships;

    setLocalDiagram({
      ...localDiagram,
      entities: updatedEntities,
      relationships: updatedRelationships,
    });
  };

  // Handle changes to attributes
  const handleAttributeChange = (entityIndex, attrIndex, field, value) => {
    const updatedEntities = [...localDiagram.entities];
    const entity = updatedEntities[entityIndex];
    const attribute = entity.attributes[attrIndex];
    const oldName = attribute.name;

    // Update the attribute field
    attribute[field] = value;

    // If the attribute is the primary key and its name is updated
    if (field === "name" && oldName === entity.primaryKey) {
      entity.primaryKey = value;

      // Update references in other entities and relationships
      updatedEntities.forEach((ent) => {
        ent.attributes.forEach((attr) => {
          if (attr.name === oldName) {
            attr.name = value; // Update foreign key references
          }
        });
      });
      setLocalDiagram({
        ...localDiagram,
        entities: updatedEntities,
      });
    } else {
      // For non-primary key attribute updates, only update the entities
      setLocalDiagram({ ...localDiagram, entities: updatedEntities });
    }
  };

  // Handle changes to relationships
  const handleRelationshipChange = (index, field, value) => {
    const updatedRelationships = [...localDiagram.relationships];
    updatedRelationships[index][field] = value;
    setLocalDiagram({ ...localDiagram, relationships: updatedRelationships });
  };

  // Save changes
  const saveChanges = () => {
    setErDiagram(localDiagram);
    updateErdiagram();
    toast.success("Changes saved successfully!", { autoClose: 1000 });
  };

  // Create a new entity
  const createEntity = () => {
    const newEntity = {
      name: "",
      primaryKey: "",
      attributes: [],
    };
    setLocalDiagram({
      ...localDiagram,
      entities: [...localDiagram.entities, newEntity],
    });
  };

  // Delete an entity
  const deleteEntity = (index) => {
    const updatedEntities = localDiagram.entities.filter((_, i) => i !== index);
    setLocalDiagram({ ...localDiagram, entities: updatedEntities });
  };

  // Create a new attribute
  const createAttribute = (entityIndex) => {
    const newAttribute = {
      name: "",
      type: "",
    };
    const updatedEntities = [...localDiagram.entities];
    updatedEntities[entityIndex].attributes.push(newAttribute);
    setLocalDiagram({ ...localDiagram, entities: updatedEntities });
  };

  // Delete an attribute
  const deleteAttribute = (entityIndex, attrIndex) => {
    const updatedEntities = [...localDiagram.entities];
    updatedEntities[entityIndex].attributes = updatedEntities[
      entityIndex
    ].attributes.filter((_, i) => i !== attrIndex);
    setLocalDiagram({ ...localDiagram, entities: updatedEntities });
  };

  // Create a new relationship
  const createRelationship = () => {
    const newRelationship = {
      type: "",
      from: "",
      to: "",
      cardinality: "",
    };
    setLocalDiagram({
      ...localDiagram,
      relationships: [...localDiagram.relationships, newRelationship],
    });
  };

  // Delete a relationship
  const deleteRelationship = (index) => {
    const updatedRelationships = localDiagram.relationships.filter(
      (_, i) => i !== index
    );
    setLocalDiagram({ ...localDiagram, relationships: updatedRelationships });
  };
  //console.log(erDiagram);
  return (
    <div className="er-edit-container scrollable-entities">
      <div className="top-edit">
        <h2>
          <FaEdit style={{ marginRight: "8px", color: "#007bff" }} />
          Edit
        </h2>
        <div className="edit-items">
          <button onClick={toggleViewMode} className="toggle-icon-btn">
            <FontAwesomeIcon icon={isViewMode ? faPen : faEye} />
          </button>
          <button onClick={saveChanges} className="save-changes-btn">
            <FontAwesomeIcon icon={faSave} style={{ marginRight: "8px" }} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="edit-entity-container">
        {localDiagram?.entities?.length > 0 &&
          localDiagram.entities.map((entity, entityIndex) => (
            <div key={entityIndex} className="entity-container">
              <div className="entity-info">
                <div className="entity-name">
                  <label>
                    Entity Name:
                    <input
                      type="text"
                      value={entity.name}
                      onChange={(e) =>
                        handleEntityChange(entityIndex, "name", e.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="entity-name">
                  <label>
                    Primary Key:
                    <input
                      type="text"
                      value={entity.primaryKey}
                      onChange={(e) =>
                        handleEntityChange(
                          entityIndex,
                          "primaryKey",
                          e.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <div className="attributes">
                  <h4>Attributes</h4>
                  {entity.attributes.map((attr, attrIndex) => (
                    <div key={attrIndex} className="attribute">
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) =>
                          handleAttributeChange(
                            entityIndex,
                            attrIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="text"
                        value={attr.type}
                        onChange={(e) =>
                          handleAttributeChange(
                            entityIndex,
                            attrIndex,
                            "type",
                            e.target.value
                          )
                        }
                      />

                      <button
                        onClick={() => deleteAttribute(entityIndex, attrIndex)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  ))}
                  <div className="attribute-btn-container">
                    <button
                      onClick={() => createAttribute(entityIndex)}
                      className="add-attribute"
                    >
                      + Attribute
                    </button>
                    <button
                      onClick={() => deleteEntity(entityIndex)}
                      className="delete-entity"
                    >
                      Delete Entity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        <button onClick={createEntity} className="add-entity">
          Add Entity
        </button>
      </div>

      <div className="edit-rel-container">
        <h3>Relationships</h3>
        {localDiagram?.relationships?.length > 0 &&
          localDiagram.relationships.map((relationship, relIndex) => (
            <div key={relIndex} className="relationship">
              <h4>{`${relationship.from}_to_${relationship.to}`}</h4>
              <label>
                From:
                <input
                  type="text"
                  value={relationship.from}
                  onChange={(e) =>
                    handleRelationshipChange(relIndex, "from", e.target.value)
                  }
                />
              </label>
              <label>
                To:
                <input
                  type="text"
                  value={relationship.to}
                  onChange={(e) =>
                    handleRelationshipChange(relIndex, "to", e.target.value)
                  }
                />
              </label>
              <label>
                Type:
                <input
                  type="text"
                  value={relationship.type}
                  onChange={(e) =>
                    handleRelationshipChange(relIndex, "type", e.target.value)
                  }
                />
              </label>
              <label>
                Cardinality:
                <input
                  type="text"
                  value={relationship.cardinality}
                  onChange={(e) =>
                    handleRelationshipChange(
                      relIndex,
                      "cardinality",
                      e.target.value
                    )
                  }
                />
              </label>
              <button onClick={() => deleteRelationship(relIndex)}>
                Delete Relationship
              </button>
            </div>
          ))}
        <button onClick={createRelationship} className="add-entity">
          Add Relationship
        </button>
      </div>
    </div>
  );
};

export default Edit;
