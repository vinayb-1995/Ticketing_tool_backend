const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    uniqueticketID: { type: String, required: true }, 
    adminName: { type: String, required: true },
    adminId: { type: String, required: true },
    adminMailID: { type: String, required: true },
    customerName: { type: String, required: true },
    customerID: { type: String, required: true },
    customerMailID: { type: String, required: true },
    customerContactNumber: { type: String, required: true },
    department: { type: String, required: true },
    subModule: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // For storing image file paths if needed
    ticketGeneratedDate: { type: Date, default: Date.now }, // Automatically sets the current date and time
    status: { 
        type: String, 
        enum: ['open', 'close', 'pending', 'resolved'], // Common for all roles, logic to restrict agent handled in controllers
        default: 'open'
    },
    adminAssigned: {
        isAssigned: { type: Boolean, default: false },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'agent' }, // Assuming 'agent' is your agent model
        assignedAt: { type: Date },
        status: { 
            type: String, 
            enum: ['open', 'close', 'pending', 'resolved'], // Admin can choose from these
            default: 'open' 
        },
        endDateAndTime: { type: Date },
        wricef: { type: String },
        actualHrs: { type: Number },
        planedHrs: { type: Number },
        actualCost: { type: Number },
        planedCost: { type: Number },
    },

    agentUpdate: {
        resolutionDetails: { type: String },
        resolvedAt: { type: Date },
        agentUpdatedDateandtime: { type: Date }, // Auto-updated with pre-save hook
        status: { 
            type: String, 
            enum: ['open', 'resolved', 'pending'], // Agent can only set 'open', 'resolved', or 'pending'
            default: 'open'
        },
        actualHrs: { type: Number },
        planedHrs: { type: Number },
        actualCost: { type: Number },
        planedCost: { type: Number },
        endDateAndTime: { type: Date },
        ReviewSolution: { type: String },
    }
}, { timestamps: true });

// Create a unique compound index on (adminmailID, ticketID)
// ticketSchema.index({ adminmailID: 1, uniqueticketID: 1 }, { unique: true });
ticketSchema.index({ adminMailID: 1, uniqueticketID: 1 }, { unique: true });
                                        

// Pre-save hook to update 'agentUpdatedDateandtime' field whenever agent updates the ticket
// ticketSchema.pre('save', function(next) {
//     if (this.isModified('agentUpdate')) {
//         this.agentUpdate.agentUpdatedDateandtime = new Date(); // Set the current date and time
//     }
//     next();
// });

const Tickets = mongoose.model('Ticket', ticketSchema);
module.exports = Tickets;
