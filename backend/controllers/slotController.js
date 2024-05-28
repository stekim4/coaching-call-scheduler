const { Slot, Call } = require('../models');
const slotController = {};
const cache = require('memory-cache');

// Create a new slot based on the provided coachId, startTime, and endTime
slotController.createSlot = async (req, res, next) => {
  try {
    const { coachId, startTime, endTime } = req.body;
    const newSlot = await Slot.create({ coachId, startTime, endTime });

    // Generate a cache key specific to the coach
    const cacheKey = `slots_${coachId}`;
    // Delete the cache for the coach's slots upon creation of new slot
    cache.del(cacheKey);

    res.locals.newSlot = newSlot;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in createSlot - failed to create a slot',
      status: 400,
      message: { err: err.message },
    });
  }
};

// Fetch slots for a specific coach based on the coachId parameter
slotController.getCoachSlots = async (req, res, next) => {
  try {
    const { coachId } = req.params;

    // Check if slots for the coach are cached, if not fetch slots including calls
    const cacheKey = `slots_${coachId}`;
    let slots = cache.get(cacheKey);
    if (!slots) {
      slots = await Slot.findAll({
        where: { coachId },
        include: [{
          model: Call,
          attributes: ['id'],
          required: false // Include slots with no association to calls in the fetch
        }]
      });
      slots = slots.filter(slot => !slot.Call); // Filter out slots that have a call
      cache.put(cacheKey, slots, 300000); // 5 min cache
    }
    res.locals.slots = slots;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in getCoachSlots - failed to fetch coach slots',
      status: 400,
      message: { err: err.message },
    });
  }
};

module.exports = slotController;