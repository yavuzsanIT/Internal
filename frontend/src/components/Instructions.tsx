import React from 'react';
import '../styles/Instructions.css';

export const Instructions: React.FC = () => {
  return (
    <section className="instructions-card">
      <h3>Nasıl Çalışır?</h3>
      <ol className="instructions-list">
        <li>
          Önce, taranacak olan OE numaraları veya çapraz kodlar içeren Excel dosyanızdaki 
          taramaya tabi olacak sütun başlıklarını veya başlıkta geçen kelimeleri giriniz.
        </li>
        <li>
          Girilen değerin başlıkta yer alması yeterlidir, tüm başlıkla aynı olması şart değildir. 
          Girilen değeri kapsayan birden fazla sütun da olabilir, sistem hepsini tarayacaktır.
        </li>
        <li>
          Örnek: <em>OE ⊂ (OE_1, OE2, OEM vb.) , TRW ⊂ (TRW_DISK, TRW, KAMPANA vb.)</em>
        </li>
        <li>
          Ardından, taranacak olan OE numaraları veya çapraz kodlar içeren Excel dosyanızı 
          "DOSYA SEÇ" butonuna tıklayarak seçin veya sürükleyip bırakın.
        </li>
        <li>"İŞLE & TARA" butonuna tıklayarak işlemi başlatın.</li>
        <li>
          Sonuç Excel dosyası hazır olduğunda, "SONUCU İNDİR" butonuna tıklayarak 
          indirebilirsiniz.
        </li>
      </ol>
      <p className="instructions-footer">
        Herhangi bir sorun olduğunda lütfen 
        <a href="mailto:bilisim@yavuzsan.com" className="contact-link">
          bilisim@yavuzsan.com
        </a>
        ile iletişime geçiniz.
      </p>
    </section>
  );
};
