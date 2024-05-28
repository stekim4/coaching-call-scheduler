const { User, Slot, Call } = require('../models');
const callController = {};
const cache = require('memory-cache');

// Create a new call based on provided studentId and slotId
callController.createCall = async (req, res, next) => {
  try {
    const { studentId, slotId } = req.body;

    const slot = await Slot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    const newCall = await Call.create({ studentId, slotId });

    // Delete the cache for calls upon creation of new call
    cache.del('calls');
    // Generate a cache key specific to the coach
    const cacheKey = `slots_${slot.coachId}`;
    // Delete the cache for the coach's slots upon creation of new call
    cache.del(cacheKey);

    res.locals.newCall = newCall;
    return next();  
  } catch (err) {
    return next({
      log: 'Express error handler caught error in createCall - failed to create call',
      status: 400,
      message: { err: err.message },
    });
  }
};

// Fetch all calls
callController.getCalls = async (req, res, next) => {
  try {
    // Check if calls are cached, if not fetch calls as well as associated slot and student data
    let calls = cache.get('calls');
    if (!calls) {
      calls = await Call.findAll({
        include: [
          { model: Slot, include: [{ model: User, as: 'coach' }] },
          { model: User, as: 'student' },
        ],
      });
      cache.put('calls', calls, 300000); // 5 min cache
    }

    res.locals.calls = calls;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in getCalls - failed to fetch calls',
      status: 400,
      message: { err: err.message },
    });
  }
};

// Update a call based on provided callId, satisfaction, and coachNotes
callController.updateCall = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { satisfaction, coachNotes } = req.body;

    // Find the call to update, as well as associated slot and student data
    const updatedCall = await Call.findByPk(callId, {
      include: [
        { model: Slot }, 
        { model: User, as: 'student' }
      ],
    });
    if (!updatedCall) {
      return res.status(404).json({ error: 'Call not found' });
    }

    updatedCall.satisfaction = satisfaction;
    updatedCall.coachNotes = coachNotes;
    await updatedCall.save();

    // Delete the cache for calls upon successful update of a call
    cache.del('calls');

    res.locals.updatedCall = updatedCall;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in updateCall - failed to update call',
      status: 400,
      message: { err: err.message },
    });
  }
};

module.exports = callController;
