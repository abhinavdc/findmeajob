import { useContext, useState, useEffect } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { validate } from 'email-validator';
import { AnimatePresence, motion } from 'framer-motion';

export default function Subscribe(props) {
  const { setEmailAlert } = useContext(ScrapeContext);
  const [state, setState] = useState({
    showModal: props.showModal,
    setModalState: props.setModalState,
    query: props.query,
    subscriberCount: props.subscriberCount,
  });

  const [email, setEmail] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [subscribed, setSubcribed] = useState(false);

  useEffect(() => {
    setState(props);
  });

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const setAlert = () => {
    if (validate(email)) {
      setEmailInvalid(false);
      setSubcribed(true);
      setEmailAlert({ query: state.query, email });
    } else {
      setEmailInvalid(true);
    }
  };

  const close = () => {
    setSubcribed(false);
    setEmail('');
    setEmailInvalid(false);
    state.updateModalState({ showModal: false });
  };

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      y: '-50px',
      opacity: 1,
      transition: { delay: 0.2 },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {state.showModal && (
        <div class={state.showModal === true ? 'is-active modal' : 'modal'}>
          <motion.div
            class="modal-background"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={close}
          ></motion.div>
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            class="modal-card p-1"
          >
            <section class="modal-card-body is-rounded-4">
              <div class="container has-margin-7">
                <div class="title is-4 has-text-centered">
                  <h3>Don't miss out!</h3>
                </div>
                <div class="has-margin-7 has-text-centered">
                  {subscribed === false ? (
                    <span>
                      Receive an alert when there's a new job matching '
                      {state.query}' 😎
                      {emailInvalid ? (
                        <p class="email-invalid-msg">
                          {' '}
                          Please enter a valid email{' '}
                        </p>
                      ) : (
                        ''
                      )}
                    </span>
                  ) : (
                    <p>Awesome! We have send a verification mail 🙂</p>
                  )}
                </div>
                <div class="columns has-margin-7">
                  <div class="column is-9">
                    <div class="control has-icons-right">
                      <input
                        class="input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleChange}
                      />
                      <span class="icon is-medium is-right">
                        <i class="fa fa-envelope-o"></i>
                      </span>
                    </div>
                  </div>
                  <div class="column is-3">
                    <button
                      class="button is-danger is-fullwidth"
                      onClick={setAlert}
                    >
                      Set Alert
                    </button>
                  </div>
                </div>
                <div class="has-text-centered">
                  <span class="subtitle is-7">
                    Join other {state.subscriberCount} subscribers 👍
                  </span>
                </div>
              </div>
            </section>
          </motion.div>
          <button
            class="modal-close is-large"
            aria-label="close"
            onClick={close}
          ></button>
        </div>
      )}
    </AnimatePresence>
    // <div class={state.showModal === true ? 'is-active modal' : 'modal'}>
    // </div>
  );
}
