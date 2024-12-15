import { Request, Response } from 'express';
import Dog from '../models/dog.model';
import axios from 'axios';
import logger from '../config/logger';

async function fetchDogImage(breed: string): Promise<string> {
  const url = `https://dog.ceo/api/breed/${breed.toLowerCase()}/images/random`;
  try {
    const { data } = await axios.get(url) as { data: { status: string, message: string } };
    if (data.status === 'success') {
      return data.message;
    }
    return '';
  } catch (error) {
    logger.error('Error fetching dog image:', error);
    return '';
  }
}

export const getDogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const createDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, breed, dateOfBirth, weight, height } = req.body;

    if (!name || !breed || !dateOfBirth || weight == null || height == null) {
      res.status(400).json({ error: 'All dog fields are required' });
      return;
    }

    const imageUrl = await fetchDogImage(breed);
    const dog = await Dog.create({ name, breed, dateOfBirth, weight, height, imageUrl });
    res.status(201).json(dog); // No "return" keyword here
    logger.info('Dog created:', dog.toJSON());
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error occurred' });
    }
  }
};

export const updateDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, breed, dateOfBirth, weight, height } = req.body;

    const dog = await Dog.findByPk(id);
    if (!dog) {
      res.status(404).json({ error: 'Dog not found' });
      return;
    }

    // If breed is changed, fetch a new image.
    if (breed && breed !== dog.breed) {
      dog.imageUrl = await fetchDogImage(breed);
    }

    dog.name = name || dog.name;
    dog.breed = breed || dog.breed;
    dog.dateOfBirth = dateOfBirth || dog.dateOfBirth;
    dog.weight = weight ?? dog.weight;
    dog.height = height ?? dog.height;

    await dog.save();
    res.status(200).json(dog);
    logger.info('Dog updated:', dog.toJSON());
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error occurred' });
    }
  }
};

export const deleteDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dog = await Dog.findByPk(id);
    if (!dog) {
      res.status(404).json({ error: 'Dog not found' });
      return;
    }

    await dog.destroy();
    res.status(204).send();
    logger.info('Dog deleted successfully:', { id: dog.id }); 
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error occurred' });
    }
  }
};
