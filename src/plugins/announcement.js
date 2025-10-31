function closeAnnouncement() {
  const announcement_wrapper = document.querySelector(".announcement_wrapper");
  const announcement_mask = document.querySelector(".announcement_mask");
  announcement_wrapper.remove();
  announcement_mask.remove();
}

function showAnnouncement(AnnouncementData, noExpireDate = false) {
  const announcement_wrapper = document.getElementById("announcement_wrapper");
  const announcement_title = document.createElement("div");
  const announcement_content = document.createElement("div");
  const announcement_close = document.createElement("div");

  announcement_title.className = "announcement-title";
  announcement_content.className = "announcement-content";
  announcement_close.className = "announcement-close";

  announcement_title.innerText = AnnouncementData.title;
  if (!noExpireDate) {
    announcement_title.innerHTML += `<div class="announcement-hashtag">#有期限: ${AnnouncementData.expireDate}</div>`;
  }
  announcement_content.innerHTML = AnnouncementData.content;
  announcement_close.innerHTML =
    '<span class="material-symbols-outlined"> close </span>';
  announcement_close.onclick = () => {
    closeAnnouncement();
  };

  announcement_wrapper.appendChild(announcement_title);

  if (AnnouncementData.picture) {
    const announcement_picture = document.createElement("img");
    announcement_picture.src = AnnouncementData.picture;
    announcement_wrapper.appendChild(announcement_picture);
  }

  announcement_wrapper.appendChild(announcement_content);
  announcement_wrapper.appendChild(announcement_close);

  if (AnnouncementData.button) {
    const announcement_button = document.createElement("a");
    const buttonData = AnnouncementData.button;
    announcement_button.className = "announcement-button";
    announcement_button.innerText = AnnouncementData.button.text;
    announcement_button.style.backgroundColor = AnnouncementData.button.color;

    announcement_button.onclick = (e) => {
      if (buttonData.onclickAction.includes("page: ")) {
        targetPage = buttonData.onclickAction.split("page: ")[1];
        closeAnnouncement();
        navigateTo(targetPage);
      } else if (buttonData.onclickAction.includes("link: ")) {
        const link = buttonData.onclickAction.split("link: ")[1];
        window.open(link, "_blank");
      }
    };
    announcement_wrapper.appendChild(announcement_button);
  }
}

fetch("./src/data/announcement.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const today = {
      date: new Date().toISOString().split("T")[0],
    };

    if (data.announce.expireDate === "/") {
      showAnnouncement(data.announce, true);
      console.log("No Expire Date");
    } else if (today.date <= data.announce.expireDate) {
      showAnnouncement(data.announce);
    } else {
      closeAnnouncement();
    }
  });