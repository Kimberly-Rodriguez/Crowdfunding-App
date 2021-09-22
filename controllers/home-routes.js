const router = require('express').Router();
const { Project, User } = require('../models');

// GET all projects for homepage
router.get('/', async (req, res) => {
  try {
    const dbProjectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const projects = dbProjectData.map((project) =>
      project.get({ plain: true })
    );
    //res.json({projects, loggedIn: req.session.loggedIn})
    res.render('homepage', {
      projects,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one project
router.get('/project/:id', async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    // If the user is logged in, allow them to view the project
    try {
      const dbProjectData = await Project.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: [
              'name',
            ],
          },
        ],
      });
      const project = dbProjectData.get({ plain: true });
      res.render('project', { project, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// GET profile
router.get('/profile/:id', async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    // If the user is logged in, allow them to view the project
    try {
      const dbProjectData = await User.findByPk(req.params.id, {
        include: [
          {
            model: Project,
            attributes: [
              'name',
              'description',
              'date_created',
              'needed_funding',
            ],
          },
        ],
      });

      const project = dbProjectData.get({ plain: true });

      res.render('project', { project, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
