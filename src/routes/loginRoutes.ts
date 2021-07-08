import { Router, Request, Response, request, NextFunction } from "express";

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined } 
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Access is denied');
}

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  res.send(`
  <form method="POST">
    <div>
      <label>Email</label>
      <input name="email" />
    </div>
    <div>
      <label>Password</label>
      <input name="password" type="password" />
    </div>
    <button>Submit</button>
  </form>
  `)
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;

  if (email && password && email === 'myemail@gmail.com' && password === 'password') {
    // Show that the user is logged in
    req.session = { loggedIn: true };

    // Redirect to the root route
    res.redirect('/');

  } else {
    res.send('Invalid email or password');
  }
});

router.get('/', (req: Request, res: Response) => {
  // req.session
  if(req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/login">Login</a>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route, logged in user');
});

export { router };



// Do not write

@controller('/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.send('form');
  }

  @post('/login')
  @validateBody('email', 'password')
  @use(requireAuth)
  postLogin(req: Request, res: Response): void {
    const { email, password } = req.body;

    if (email && password && email === 'myemail@gmail.com' && password === 'password') {
      // Show that the user is logged in
      req.session = { loggedIn: true };

      // Redirect to the root route
      res.redirect('/');

    } else {
      res.send('Invalid email or password');
    }
  }
}