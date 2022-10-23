import React, { useLayoutEffect, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AppContainer } from './App.styled';
import { SearchbarForm } from './Searchbar/Searchbar';
import { GalleryImageList } from './ImageGalleryList/ImageGalleryList';
import { ButtonShowMore } from './ButtonShowMore/ButtonShowMore';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import axios from 'axios';

export function App() {
  const [searchQueryString, setSearchQueryString] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [modalCard, setModalCard] = useState(null);
  const [status, setStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchQueryString === '') {
      return;
    }

    const getInfoFromApi = async (queryString, page) => {
      const respons = await axios(
        `https://pixabay.com/api/?q=${queryString}&page=${page}&key=29686062-6a845a2f1faff990e4be6d419&image_type=photo&orientation=horizontal&per_page=12`
      );
      return respons.data.hits;
    };

    try {
      setStatus('pending');
      getInfoFromApi(searchQueryString, page).then(res => {
        setImages(state => [...state, ...res]);
        setStatus('resolved');
      });
    } catch (error) {
      setStatus('rejected');
    }
  }, [page, searchQueryString]);

  // useLayoutEffect(() => {
  //   console.log('----');
  //   window.scrollBy({
  //     top: window.screen.availHeight / (page / window.screen.availHeight),
  //     behavior: 'smooth',
  //   });
  //   // if (boxRef === null) { return }
  //   // console.log("scrol")
  //   // window.current.scrollTo({ top: boxRef.current.scrollHeight });
  // }, [page]);

  const submitForm = ({ queryString }, { resetForm }) => {
    if (!queryString.trim()) {
      resetForm();
      return;
    }

    if (searchQueryString === queryString) {
      resetForm();
      return;
    }

    setImages([]);
    setPage(1);
    setSearchQueryString(queryString);
    resetForm();
  };

  const showMore = () => {
    setPage(prevState => {
      return prevState + 1;
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  function seeModal(id) {
    setShowModal(true);
    const modalCard = images.find(image => image.id === id);
    setModalCard(modalCard);
  }

  return (
    <AppContainer>
      <SearchbarForm onSubmit={submitForm} />
      {status === 'resolved' && (
        <GalleryImageList images={images} showModal={seeModal} />
      )}
      {status === 'resolved' && images.length / page === 12 && (
        <ButtonShowMore showMore={showMore} />
      )}
      {status === 'pending' && <Loader />}
      {status === 'rejected' && toast.warning('Please try again')}
      {showModal && <Modal modalCard={modalCard} closeModal={closeModal} />}
      <ToastContainer autoClose={3000} />
    </AppContainer>
  );
}

// export class App extends Component {
//   state = {
//     queryString: '',
//     images: [],
//     page: 1,
//     modalCard: null,
//     status: 'idle',
//     showModal: false,
//     totalHits: 0,
//   };

//   async componentDidUpdate(_, prevState) {
//     const { queryString, page, images } = this.state;

//     if (prevState.images !== images) {
//       this.ScrollByGallery(page);
//     }

//     if (prevState.queryString !== queryString || prevState.page !== page) {
//       try {
//         this.setState({ status: 'pending' });
//         const response = await fetchImages(queryString, page);
//         this.setState(prevState => {
//           return {
//             images: [...prevState.images, ...response],
//             status: 'resolved',
//           };
//         });
//       } catch (error) {
//         this.setState({ status: 'rejected' });
//         console.log(error);
//       }
//     }
//   }

//   submitForm = ({ queryString }, { resetForm }) => {
//     if (!queryString.trim()) {
//       resetForm();
//       return;
//     }
//     if (queryString === this.state.queryString) {
//       resetForm();
//       return;
//     }
//     this.setState({ images: [], page: 1, queryString: queryString });
//     resetForm();
//   };

//   ScrollByGallery = page => {
//     window.scrollBy({
//       top: window.screen.availHeight / (page / window.screen.availHeight),
//       behavior: 'smooth',
//     });
//   };

//   showMore = () => {
//     this.setState(prevState => {
//       return { page: prevState.page + 1 };
//     });
//   };

//   closeModal = () => {
//     this.setState({ showModal: false });
//   };

//   showModal = id => {
//     this.setState({ showModal: true });
//     const modalCard = this.state.images.find(image => image.id === id);
//     this.setState({ modalCard });
//   };

//   render() {
//     const { images, page, status, showModal, modalCard } = this.state;

//     return (
//       <AppContainer>
//         <SearchbarForm onSubmit={this.submitForm} />
//         {status === 'resolved' && (
//           <GalleryImageList images={images} showModal={this.showModal} />
//         )}
//         {status === 'resolved' && images.length / page === 12 && (
//           <ButtonShowMore showMore={this.showMore} />
//         )}
//         {status === 'pending' && <Loader />}
//         {status === 'rejected' && toast.warning('Please try again')}
//         {showModal && (
//           <Modal modalCard={modalCard} closeModal={this.closeModal} />
//         )}
//         <ToastContainer autoClose={3000} />
//       </AppContainer>
//     );
//   }
// }
