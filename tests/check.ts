<div class="vGroup" style = "padding:10px;height:100%;" >
    <div class="DetailViewHeader" style = "height:10%;border: 1px solid;width:100%;" >
        <div class="vGroup" style = "padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;" >
            <div class="hGroup" style = "font-size:15px;" >
                <label data - testid="fundingRefLabel" > Funding Ref: </label>
                    < label data - testid="fundingRefValue" > {{ recFundingRequestsEx?.Ref }} { { recFundingRequestsEx?.Title } } </label>
                        < /div>
                        < div class="hGroup" >
                            <div class="hGroup" style = "width:33%;font-size:15px;" >
                                <label data - testid="statusLabel" > Status: </label>
                                    < label data - testid="statusValue" > {{ recFundingRequestsEx?.Status }}</label>
                                        < /div>
                                        < div class="hGroup" style = "width:33%;font-size:15px;" >
                                            <label data - testid="submittedDateLabel" > Submitted Date: </label>
                                                < label data - testid="submittedDateValue" > {{ molUtil?.formatDate(recFundingRequestsEx.SubmittedDate) }}</label>
                                                    < /div>
                                                    < div class="hGroup" style = "width:33%;font-size:15px;" >
                                                        <label data - testid="applicationIdLabel" > Application ID: </label>
                                                            < label data - testid="applicationIdValue" > {{ recFundingRequestsEx?.ApplicationRef }}</label>
                                                                < /div>
                                                                < /div>
                                                                < /div>
                                                                < /div>
                                                                < mol - angular - acknowledge - request - vbox #acknowledgeRequestView
                                                                [recFundingRequestsEx] = "recFundingRequestsEx"
                                                                [isCalledFromAdminEdit] = "true"
style = "height:100%;"
    > </mol-angular-acknowledge-request-vbox>
    < div class="DetailViewFooter" style = "height:40px;border: 1px solid;width:100%;" >
        <div class="hGroup" style = "height:100%;width:100%;justify-content:center;" >
            <button class="SmallButton" style = "margin-right:10px;"
data - testid="saveAcknowledgeButton"
    (click) = "saveAcknowledge()"
    [disabled] = "!(recFundingRequestsEx.Phase === 2)" > Save - Acknowledge Request
        < /button>
        < button class="SmallButton"
data - testid="saveNoAcknowledgeButton"
    (click) = "saveNoAcknowledge()" > Save - No Acknowledge
        < /button>
        < button class="SmallButton" style = "margin-left:40px;"
data - testid="closeButton"
    (click) = "closeMe()" > Close
    < /button>
    < /div>
    < /div>
    < /div>


Changes made:

- Added`data-testid="fundingRefLabel"` and `data-testid="fundingRefValue"` to the Funding Ref's label and value.
    - Added`data-testid="statusLabel"` and `data-testid="statusValue"` to the Status label and value.
- Added`data-testid="submittedDateLabel"` and `data-testid="submittedDateValue"` to the Submitted Date label and value.
- Added`data-testid="applicationIdLabel"` and `data-testid="applicationIdValue"` to the Application ID label and value.
- Added`data-testid="saveAcknowledgeButton"` to the "Save - Acknowledge Request" button.
- Added`data-testid="saveNoAcknowledgeButton"` to the "Save - No Acknowledge" button.
- Added`data-testid="closeButton"` to the Close button.