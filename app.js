import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import connectMongoDB from './mongodb.js'; 

import { ObjectId } from 'mongodb';
const app = express();
const port = 3000;


app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

app.get('/api/v3/app/events', async (req, res) => {
  const eventId = req.query.id;

  if (!eventId) {
      return res.status(400).json({ error: 'Id missing' });
  }
  try {
      const { client, db } = await connectMongoDB();
      const collection = db.collection('Events');
      const event = await collection.findOne({ _id: new ObjectId(eventId) });

      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json({ event });
      client.close();
  } catch (error) {
      console.error('Error', error);
      res.status(500).json({ error: 'Error' });
  } 
});



app.post('/api/v3/app/events', upload.single('image'), async (req, res) => {
    const {
        uid,
        name,
        tagline,
        schedule,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank,
        attendees
    } = req.body;

    const imageFile = req.file;

    const event = {
        uid,
        name,
        tagline,
        schedule,
        description,
        image: imageFile ? imageFile.path : null,
        moderator,
        category,
        sub_category,
        rigor_rank,
        attendees
    };

    try {
        const { client, db } = await connectMongoDB();
        const collection = db.collection("Events"); 
        const result = await collection.insertOne(event);
        res.status(201).json({
            message: 'Event created ',
            event: { _id: result.insertedId, ...event }
        });

        client.close(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error ' });
    }
});

app.put('/api/v3/app/events/:id', upload.single('image'), async (req, res) => {
  const {
      uid,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees
  } = req.body;

  const imageFile = req.file;

  const event = {
      uid,
      name,
      tagline,
      schedule,
      description,
      image: imageFile ? imageFile.path : null,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees
  };

  try {
      const { client, db } = await connectMongoDB();
      const collection = db.collection("Events"); 
      const result = await collection.updateOne(event);
      res.status(201).json({
          message: 'Event created successfully',
          event: { _id: result.insertedId, ...event }
      });

      client.close(); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error' });
  }
});

app.delete('/api/v3/app/events', async (req, res) => {
    const eventId = req.query.id;

    if (!eventId) {
        return res.status(400).json({ error: 'ID Missing  ' });
    }

    try {
        const { client ,db } = await connectMongoDB();
        const collection = db.collection('Events');
        const result = await collection.deleteOne({ _id: new ObjectId(eventId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event already deleted' });
        }

        res.status(200).json({ message: 'Event deleted' });
        client.close();
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Error' });
    } 
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});