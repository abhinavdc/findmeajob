import { useContext, useState, useEffect } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { validate } from 'email-validator';

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

  return (
    <div class={state.showModal === true ? 'is-active modal' : 'modal'}>
      <div class="modal-background" onClick={close}></div>
      <div class="modal-card p-1">
        <section class="modal-card-body is-rounded-4">
          <div class="container">
            <div class="title is-4 has-text-centered">
              <h3>Don't miss out!</h3>
            </div>
            <div class="m-2 has-text-centered">
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
            <div class="columns m-2">
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
                  class="button is-primary is-fullwidth"
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
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  );
}
