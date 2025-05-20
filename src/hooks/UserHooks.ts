import { useState, useEffect } from "react";

// hooks
import { useRedux } from "../hooks/index";

// api
import { getLoggedinUser } from "../api/apiCore";
import { createSelector } from "reselect";
//utils
import { divideByKey } from "../utils";

const useProfile = () => {
  const { useAppSelector } = useRedux();

  const errorData = createSelector(
    (state: any) => state.Settings,
    state => ({
      settings: state.settings,
    }),
  );

  const { settings } = useAppSelector(errorData);
  const image = settings.basicDetails && settings.basicDetails.profile;

  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState<any>(null); 

  // Cambia a objeto vacío
  // const [userProfile, setUserProfile] = useState<any>({});


  useEffect(() => {
    const userProfileSession = getLoggedinUser();

    // 👇 Aquí pones el console.log
    console.log("👤 getLoggedinUser():", userProfileSession);

    if (userProfileSession) {
  setUserProfile({
    ...userProfileSession,
    uid: userProfileSession.uid || userProfileSession.id,
    profileImage: image,
  });
}else {
      setUserProfile(null); // <- Usar null

      // Pon objeto vacío en vez de null
      // setUserProfile({});
    }

    setLoading(false); // ✅ aquí marcamos que terminó de cargar
  }, [image]);

  return { userProfile, loading };
};

const useContacts = () => {
  // global store
  const { useAppSelector } = useRedux();

  // const { contactsList } = useAppSelector(state => ({
  //   contactsList: state.Contacts.contacts,
  // }));

  const errorData = createSelector(
    (state: any) => state.Contacts,
    state => ({
      contactsList: state.contacts,
    }),
  );
  // Inside your component
  const { contactsList } = useAppSelector(errorData);

  const [contacts, setContacts] = useState<Array<any>>([]);
  const [categorizedContacts, setCategorizedContacts] = useState<Array<any>>(
    [],
  );
  useEffect(() => {
    if (contactsList.length > 0) {
      setContacts(contactsList);
    }
  }, [contactsList]);

  useEffect(() => {
    if (contacts.length > 0) {
      const formattedContacts = divideByKey("firstName", contacts);
      setCategorizedContacts(formattedContacts);
    }
  }, [contacts]);

  const totalContacts = (categorizedContacts || []).length;
  return { categorizedContacts, totalContacts };
};

const useConversationUserType = () => {
  // global store
  const { useAppSelector } = useRedux();

  // const { chatContactDetails } = useAppSelector(state => ({
  //   chatContactDetails: state.Chats.chatContactDetails,
  // }));

  const errorData = createSelector(
    (state: any) => state.Chats,
    state => ({
      chatContactDetails: state.chatContactDetails,
    }),
  );
  // Inside your component
  const { chatContactDetails } = useAppSelector(errorData);

  const [isChannel, setIsChannel] = useState<boolean>(false);
  useEffect(() => {
    setIsChannel(chatContactDetails.isChannel ? true : false);
  }, [chatContactDetails]);

  return { isChannel };
};
export { useProfile, useContacts, useConversationUserType };
