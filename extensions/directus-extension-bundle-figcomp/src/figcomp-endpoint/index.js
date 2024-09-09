export default {
  id: 'figma-components',
  handler: (router) => {
      router.get('/', async (req, res) => {
          try {
              const components = await req.storage.get('figma_components');
              res.json(components);
          } catch (error) {
              res.status(500).send(error.message);
          }
      });

      router.post('/', async (req, res) => {
          try {
              const newComponent = req.body;
              await req.storage.create('figma_components', newComponent);
              res.status(201).json(newComponent);
          } catch (error) {
              res.status(500).send(error.message);
          }
      });
  }
};