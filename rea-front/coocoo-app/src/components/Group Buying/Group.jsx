function Group ({group}){
    return(
        <div className="groups-selection">
        {groups.map((group) => (
          <div className="group" key={group.id}>
            <span className="group-name">{group.name}</span>
            <div className="group-information">
              <div className="select-btn">
                <input
                  className="select-btn"
                  type="radio"
                  name="join-group"
                  onClick={() => SelectGroup(group.id)}
                />
              </div>
              <div className="progress">
                <span>Progress</span>
                <span className="number-of-farmers">
                  {group.current_farmers}/{group.target_farmers} farmers
                </span>
              </div>
              <div className="product">
                <span>Product</span>
                <span className="feed-name">{group.product}</span>
              </div>
              <div className="price">
                <span className="price">
                  R{group.price_per_person.toFixed(2)}
                </span>
                <span className="per-person">per person</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
}

export default Group