import React from "react";

interface BasicDetailsProps {
  chatContactDetails: any;
}
const BasicDetails = ({ chatContactDetails }: BasicDetailsProps) => {
  const fullName = chatContactDetails.firstName
    ? `${chatContactDetails.firstName} ${chatContactDetails.lastName}`
    : "-";

  return (
    <div className="pb-2">
      <h5 className="font-size-11 text-uppercase mb-2">Info :</h5>
      <div>
        <div className="d-flex align-items-end">
          <div className="flex-grow-1">
            <p className="text-muted font-size-14 mb-1">Name</p>
          </div>
          <div className="flex-shrink-0">
            <button type="button" className="btn btn-sm btn-soft-primary">
              Edit
            </button>
          </div>
        </div>
        <h5 className="font-size-14">{fullName}</h5>
      </div>

      <div className="mt-4">
        <p className="text-muted font-size-14 mb-1">Email</p>
        <h5 className="font-size-14">
          {chatContactDetails.email ? chatContactDetails.email : "-"}
        </h5>
      </div>

      <div className="mt-4">
        <p className="text-muted font-size-14 mb-1">Location</p>
        <h5 className="font-size-14 mb-0">
          {chatContactDetails.location ? chatContactDetails.location : "-"}
        </h5>
      </div>
    </div>
  );
};

export default BasicDetails;
