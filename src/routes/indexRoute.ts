import express , {Application} from 'express';
import authAPI from './authAPI';
import contactAPI from './contactAPI';
import searchAPI from './searchAPI';
import spamAPI from './spamAPI';

const router:Application = express();

router.use('/auth', authAPI);
router.use('/contacts', contactAPI);
router.use('/search', searchAPI);
router.use('/spam', spamAPI);

export default router;
